import os
import io
from contextlib import asynccontextmanager
from typing import List, Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

WASTE_MODEL_PATH = os.getenv("WASTE_MODEL_PATH", "./model/best.pt")
POTHOLE_MODEL_PATH = os.getenv("POTHOLE_MODEL_PATH", "./model/civicmodel.pt")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.45"))

waste_model = None
pothole_model = None

def load_models():
    global waste_model, pothole_model
    from ultralytics import YOLO

    if os.path.exists(WASTE_MODEL_PATH):
        try:
            waste_model = YOLO(WASTE_MODEL_PATH)
            print(f"Waste model loaded: {WASTE_MODEL_PATH}")
        except Exception as e:
            print(f"Failed to load waste model: {e}")
            waste_model = None
    else:
        print(f"Waste model not found at {WASTE_MODEL_PATH}")

    if os.path.exists(POTHOLE_MODEL_PATH):
        try:
            pothole_model = YOLO(POTHOLE_MODEL_PATH)
            print(f"Pothole model loaded: {POTHOLE_MODEL_PATH}")
        except Exception as e:
            print(f"Failed to load pothole model: {e}")
            pothole_model = None
    else:
        print(f"Pothole model not found at {POTHOLE_MODEL_PATH}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_models()
    yield


app = FastAPI(
    title="CivicLens AI Vision Service",
    description="YOLOv8 Object Detection for Waste and Pothole Detection",
    version="2.0.0",
    lifespan=lifespan,
)

_RAW_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,https://civic-lens-blush.vercel.app"
)
ALLOWED_ORIGINS = [o.strip() for o in _RAW_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "CivicLens AI Vision Service",
        "status": "online",
        "wasteModelLoaded": waste_model is not None,
        "potholeModelLoaded": pothole_model is not None,
        "confidenceThreshold": CONFIDENCE_THRESHOLD,
    }

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "waste_model_active": waste_model is not None,
        "pothole_model_active": pothole_model is not None,
    }

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Please upload an image (JPEG, PNG, WEBP)."
        )

    try:
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        width, height = pil_image.size
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Unable to decode image: {str(e)}"
        )

    detections: List[Dict[str, Any]] = []

    if waste_model is not None:
        try:
            results = waste_model(pil_image, conf=CONFIDENCE_THRESHOLD)
            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    cls_name = r.names.get(cls_id, f"class_{cls_id}").lower()
                    conf = float(box.conf[0])
                    xyxy = [float(val) for val in box.xyxy[0].tolist()]
                    if conf >= CONFIDENCE_THRESHOLD:
                        detections.append({
                            "class": cls_name,
                            "confidence": round(conf, 4),
                            "bbox": [round(coord, 1) for coord in xyxy],
                            "source": "waste_model"
                        })
        except Exception as err:
            print(f"Waste model inference error: {err}")

    if pothole_model is not None:
        try:
            results = pothole_model(pil_image, conf=CONFIDENCE_THRESHOLD)
            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    cls_name = r.names.get(cls_id, f"class_{cls_id}").lower()
                    conf = float(box.conf[0])
                    xyxy = [float(val) for val in box.xyxy[0].tolist()]
                    if conf >= CONFIDENCE_THRESHOLD:
                        detections.append({
                            "class": "pothole" if "pothole" in cls_name else cls_name,
                            "confidence": round(conf, 4),
                            "bbox": [round(coord, 1) for coord in xyxy],
                            "source": "pothole_model"
                        })
        except Exception as err:
            print(f"Pothole model inference error: {err}")

    # Filter out full-frame false positives
    valid_detections: List[Dict[str, Any]] = []
    for det in detections:
        bbox = det.get("bbox", [])
        if len(bbox) == 4:
            box_w = bbox[2] - bbox[0]
            box_h = bbox[3] - bbox[1]
            is_full_frame = (box_w >= 0.95 * width) and (box_h >= 0.95 * height)
            if is_full_frame and det["confidence"] < 0.70:
                continue
        valid_detections.append(det)

    valid_detections = sorted(valid_detections, key=lambda x: x["confidence"], reverse=True)

    waste_detections = [d for d in valid_detections if d.get("source") == "waste_model"]
    pothole_detections = [d for d in valid_detections if d.get("source") == "pothole_model"]

    top_waste = waste_detections[0] if waste_detections else None
    top_pothole = pothole_detections[0] if pothole_detections else None

    if top_waste:
        is_waste = True
        yolo_detected = True
        yolo_category = top_waste["class"].upper()
        yolo_confidence = top_waste["confidence"]
        verification_source = "yolo"
        primary_category = top_waste["class"].lower()
    elif top_pothole:
        is_waste = False
        yolo_detected = True
        yolo_category = "POTHOLE"
        yolo_confidence = top_pothole["confidence"]
        verification_source = "pothole_model"
        primary_category = "pothole"
    else:
        is_waste = False
        yolo_detected = False
        yolo_category = None
        yolo_confidence = 0.0
        verification_source = "none"
        primary_category = "unknown"

    return {
        "success": True,
        "is_waste": is_waste,
        "category": yolo_category or "UNKNOWN",
        "yolo_detected": yolo_detected,
        "yolo_category": yolo_category,
        "yolo_confidence": yolo_confidence,
        "verification_source": verification_source,
        "detections": valid_detections,
        "summary": {
            "primaryCategory": primary_category,
            "primaryLabel": yolo_category or "Unknown",
            "totalObjects": len(valid_detections)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000)
