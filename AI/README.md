# CivicLens AI — Waste Classification Python Service

This Python FastAPI service runs custom **YOLOv8s object detection** for civic waste classification.

## Target Waste Categories
- `plastic`
- `paper`
- `cardboard`
- `glass`
- `metal`
- `organic`

---

## Setup Instructions

### 1. Place Model Weights
Place your trained YOLOv8 PyTorch model file `best.pt` in the `model/` directory:
```text
AI/
└── model/
    └── best.pt
```

### 2. Install Dependencies
```bash
cd AI
pip install -r requirements.txt
```

### 3. Run the AI Service
```bash
python -m uvicorn app:app --reload --port 8000
```
The service will start on `http://localhost:8000`.

---

## API Endpoints

### `POST /predict`
- **Content-Type**: `multipart/form-data`
- **Body**: `image` file field

**Example Response**:
```json
{
  "success": true,
  "detections": [
    {
      "class": "plastic",
      "confidence": 0.94,
      "bbox": [120, 80, 350, 420]
    }
  ],
  "summary": {
    "primaryCategory": "plastic",
    "totalObjects": 1
  }
}
```
