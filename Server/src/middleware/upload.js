// ============================================================
// middleware/upload.js - MULTER FILE UPLOAD MIDDLEWARE
// ============================================================

import multer from "multer";

// Memory storage keeps file buffers in memory (no temp files on disk)
const storage = multer.memoryStorage();

// Validate file type (Images only)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.");
    error.statusCode = 400;
    cb(error, false);
  }
};

// 5MB Max File Size limit
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes
  },
  fileFilter,
});

export const uploadSingleImage = upload.single("image");
export default uploadSingleImage;
