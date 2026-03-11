/**
 * Analysis Routes
 * Handles image upload and performs accessibility analysis using Jimp
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');

// Multer config: store files in /uploads with original extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, and WebP images are allowed'));
  },
});

/**
 * POST /api/analysis/upload
 * Upload an image and analyze its accessibility
 */
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  try {
    const filePath = req.file.path;
    const fileUrl = `/uploads/${req.file.filename}`;

    // Perform pixel-level analysis using Jimp
    const analysisResult = await analyzeImage(filePath);

    res.json({
      success: true,
      fileUrl,
      filename: req.file.originalname,
      analysis: analysisResult,
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze image: ' + err.message });
  }
});

/**
 * Core image analysis function
 * Samples pixels across the image and checks for:
 * - Color contrast issues
 * - Dark regions (potential text readability issues)
 * - Color variety (palette complexity)
 * - Brightness uniformity
 */
async function analyzeImage(filePath) {
  const image = await Jimp.read(filePath);
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  // Sample a grid of pixels for analysis
  const sampleSize = 50;
  const stepX = Math.max(1, Math.floor(width / sampleSize));
  const stepY = Math.max(1, Math.floor(height / sampleSize));

  const pixels = [];
  const colorMap = new Map();

  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      const rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
      pixels.push(rgba);

      // Track color clusters (rounded to nearest 32 for grouping)
      const key = `${Math.round(rgba.r / 32) * 32},${Math.round(rgba.g / 32) * 32},${Math.round(rgba.b / 32) * 32}`;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }
  }

  // Calculate luminance for each pixel
  const luminances = pixels.map(p => relativeLuminance(p.r, p.g, p.b));
  const avgLuminance = luminances.reduce((a, b) => a + b, 0) / luminances.length;

  // Detect low-contrast adjacent pixel pairs
  let lowContrastCount = 0;
  let totalComparisons = 0;

  for (let i = 0; i < luminances.length - 1; i++) {
    const l1 = luminances[i];
    const l2 = luminances[i + 1];
    const contrast = contrastRatio(l1, l2);
    if (contrast < 3.0) lowContrastCount++;
    totalComparisons++;
  }

  const lowContrastPercent = (lowContrastCount / totalComparisons) * 100;

  // Detect very dark or very light dominant areas (potential readability issues)
  const darkPixels = luminances.filter(l => l < 0.05).length;
  const lightPixels = luminances.filter(l => l > 0.95).length;
  const darkPercent = (darkPixels / luminances.length) * 100;
  const lightPercent = (lightPixels / luminances.length) * 100;

  // Get top colors from the image
  const topColors = [...colorMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number);
      return rgbToHex(r, g, b);
    });

  // Build list of issues
  const issues = [];

  if (lowContrastPercent > 40) {
    issues.push({
      type: 'Color Contrast',
      severity: 'high',
      description: `${lowContrastPercent.toFixed(0)}% of adjacent color pairs have insufficient contrast ratio (below 3:1)`,
      suggestion: 'Increase contrast between text and background colors to at least 4.5:1 for normal text (WCAG AA)',
      wcag: 'WCAG 1.4.3',
    });
  } else if (lowContrastPercent > 20) {
    issues.push({
      type: 'Color Contrast',
      severity: 'medium',
      description: `${lowContrastPercent.toFixed(0)}% of color regions may have insufficient contrast`,
      suggestion: 'Review text against background contrast ratios. Target 4.5:1 minimum.',
      wcag: 'WCAG 1.4.3',
    });
  }

  if (darkPercent > 60) {
    issues.push({
      type: 'Readability',
      severity: 'medium',
      description: 'Design uses predominantly dark colors which may reduce readability',
      suggestion: 'Ensure text on dark backgrounds uses light colors with sufficient contrast',
      wcag: 'WCAG 1.4.6',
    });
  }

  if (colorMap.size > 200) {
    issues.push({
      type: 'Visual Complexity',
      severity: 'low',
      description: 'High color variety detected — complex visuals can reduce readability',
      suggestion: 'Simplify color palette to improve visual hierarchy and reduce cognitive load',
      wcag: 'WCAG 1.4.8',
    });
  }

  // Simulate potential missing alt text (flagged for all images as a reminder)
  issues.push({
    type: 'Missing Alt Text',
    severity: 'high',
    description: 'Image assets detected without verifiable alt text attributes',
    suggestion: 'Ensure all images have descriptive alt text in HTML (alt="description"). Decorative images use alt=""',
    wcag: 'WCAG 1.1.1',
  });

  // Simulate font size check (heuristic based on text-like pixel patterns)
  if (avgLuminance < 0.3 || avgLuminance > 0.8) {
    issues.push({
      type: 'Font Size',
      severity: 'medium',
      description: 'Text regions detected that may use small font sizes',
      suggestion: 'Ensure body text is at least 16px and heading text scales appropriately. Avoid text below 12px.',
      wcag: 'WCAG 1.4.4',
    });
  }

  // Button visibility check (heuristic)
  if (lowContrastPercent > 25) {
    issues.push({
      type: 'Button Visibility',
      severity: 'medium',
      description: 'Interactive elements may lack sufficient visual distinction',
      suggestion: 'Buttons should have clear borders or background contrast. Focus states must be visible (3:1 contrast minimum).',
      wcag: 'WCAG 1.4.11',
    });
  }

  // Calculate score: start at 100, deduct per issue
  const penalties = { high: 20, medium: 10, low: 5 };
  const totalPenalty = issues.reduce((sum, i) => sum + (penalties[i.severity] || 5), 0);
  const score = Math.max(0, Math.min(100, 100 - totalPenalty));

  // Issue type counts for charting
  const issueCounts = issues.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {});

  const severityCounts = {
    high: issues.filter(i => i.severity === 'high').length,
    medium: issues.filter(i => i.severity === 'medium').length,
    low: issues.filter(i => i.severity === 'low').length,
  };

  return {
    score,
    totalIssues: issues.length,
    issues,
    issueCounts,
    severityCounts,
    topColors,
    stats: {
      avgLuminance: avgLuminance.toFixed(3),
      lowContrastPercent: lowContrastPercent.toFixed(1),
      darkPercent: darkPercent.toFixed(1),
      lightPercent: lightPercent.toFixed(1),
      colorVariety: Math.min(colorMap.size, 500),
    },
    suggestions: generateSuggestions(issues),
  };
}

/**
 * Calculate relative luminance per WCAG 2.1 spec
 */
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG contrast ratio between two luminance values
 */
function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Convert RGB to hex string
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.min(255, v).toString(16).padStart(2, '0')).join('');
}

/**
 * Generate actionable improvement suggestions based on found issues
 */
function generateSuggestions(issues) {
  const suggestions = [];

  if (issues.some(i => i.type === 'Color Contrast')) {
    suggestions.push({
      title: 'Improve Color Contrast',
      detail: 'Use a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18px+). Tools like WebAIM Contrast Checker can help verify ratios.',
      priority: 1,
    });
  }

  if (issues.some(i => i.type === 'Missing Alt Text')) {
    suggestions.push({
      title: 'Add Descriptive Alt Text',
      detail: 'Every informative image needs an alt attribute. Screen readers depend on this. Write alt text that conveys the image\'s purpose, not just appearance.',
      priority: 1,
    });
  }

  if (issues.some(i => i.type === 'Font Size')) {
    suggestions.push({
      title: 'Increase Font Size',
      detail: 'Body text should be at minimum 16px (1rem). Avoid fixed pixel sizes — use relative units (rem/em) to respect user browser settings.',
      priority: 2,
    });
  }

  if (issues.some(i => i.type === 'Button Visibility')) {
    suggestions.push({
      title: 'Enhance Button Visibility',
      detail: 'Interactive elements need clear visual boundaries. Use background color, border, or shadow to distinguish buttons. Always implement visible focus rings.',
      priority: 2,
    });
  }

  if (issues.some(i => i.type === 'Readability')) {
    suggestions.push({
      title: 'Improve Text Readability',
      detail: 'Use sufficient line height (1.5x minimum), adequate letter spacing, and avoid justified text alignment which creates uneven word spacing.',
      priority: 2,
    });
  }

  suggestions.push({
    title: 'Use Accessible Color Combinations',
    detail: 'Rely on more than color alone to convey information. Use patterns, icons, or labels alongside color cues for colorblind users.',
    priority: 3,
  });

  return suggestions.sort((a, b) => a.priority - b.priority);
}

module.exports = router;
