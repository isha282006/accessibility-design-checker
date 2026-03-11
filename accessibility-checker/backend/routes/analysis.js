/**
 * Analysis Routes
 * Handles image upload and performs accessibility analysis
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// FIXED JIMP IMPORT (important for Render)
const Jimp = require("jimp").default || require("jimp");

// =============================
// Multer Storage Config
// =============================

const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WEBP allowed"));
    }
  },
});

// =============================
// POST /api/analysis/upload
// =============================

router.post("/upload", upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image uploaded",
      });
    }

    const filePath = req.file.path;

    const result = await analyzeImage(filePath);

    return res.json({
      success: true,
      filename: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      analysis: result,
    });

  } catch (err) {

    console.error("Analysis error:", err);

    return res.status(500).json({
      success: false,
      error: err.message || "Image analysis failed",
    });

  }
});

// =============================
// IMAGE ANALYSIS FUNCTION
// =============================

async function analyzeImage(filePath) {

  let image;

  try {
    image = await Jimp.read(filePath);
  } catch (err) {
    console.error("Jimp read error:", err);
    throw new Error("Image processing failed");
  }

  const width = image.bitmap.width;
  const height = image.bitmap.height;

  const sampleSize = 50;

  const stepX = Math.max(1, Math.floor(width / sampleSize));
  const stepY = Math.max(1, Math.floor(height / sampleSize));

  const pixels = [];

  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {

      const rgba = Jimp.intToRGBA(
        image.getPixelColor(x, y)
      );

      pixels.push(rgba);

    }
  }

  const luminances = pixels.map(p =>
    relativeLuminance(p.r, p.g, p.b)
  );

  const avg =
    luminances.reduce((a, b) => a + b, 0) /
    luminances.length;

  let lowContrast = 0;

  for (let i = 0; i < luminances.length - 1; i++) {

    const ratio = contrastRatio(
      luminances[i],
      luminances[i + 1]
    );

    if (ratio < 3) lowContrast++;

  }

  const lowContrastPercent =
    (lowContrast / luminances.length) * 100;

  const issues = [];

  if (lowContrastPercent > 40) {
    issues.push({
      type: "Color Contrast",
      severity: "high",
      description: "Large areas have insufficient contrast",
      wcag: "WCAG 1.4.3",
    });
  }

  if (avg < 0.2) {
    issues.push({
      type: "Readability",
      severity: "medium",
      description:
        "Very dark UI detected which may affect readability",
      wcag: "WCAG 1.4.6",
    });
  }

  // Score Calculation

  const penalties = { high: 20, medium: 10, low: 5 };

  const totalPenalty = issues.reduce(
    (sum, i) => sum + penalties[i.severity],
    0
  );

  const score = Math.max(0, 100 - totalPenalty);

  return {
    score,
    totalIssues: issues.length,
    issues,
  };

}

// =============================
// WCAG HELPERS
// =============================

function relativeLuminance(r, g, b) {

  const [rs, gs, bs] = [r, g, b].map(c => {

    const s = c / 255;

    return s <= 0.03928
      ? s / 12.92
      : Math.pow((s + 0.055) / 1.055, 2.4);

  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;

}

function contrastRatio(l1, l2) {

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);

}

module.exports = router;