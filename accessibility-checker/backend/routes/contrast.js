/**
 * Contrast Checker Routes
 * WCAG contrast ratio calculation between two colors
 */

const express = require('express');
const router = express.Router();

/**
 * POST /api/contrast/check
 * Body: { color1: '#hex', color2: '#hex' }
 * Returns contrast ratio and WCAG pass/fail levels
 */
router.post('/check', (req, res) => {
  const { color1, color2 } = req.body;

  if (!color1 || !color2) {
    return res.status(400).json({ error: 'Both color1 and color2 are required' });
  }

  try {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) {
      return res.status(400).json({ error: 'Invalid hex color format. Use #RRGGBB' });
    }

    const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
    const ratio = contrastRatio(l1, l2);

    res.json({
      ratio: parseFloat(ratio.toFixed(2)),
      color1,
      color2,
      wcag: {
        AA_normal: ratio >= 4.5,    // Normal text (< 18px)
        AA_large: ratio >= 3.0,     // Large text (>= 18px or 14px bold)
        AAA_normal: ratio >= 7.0,   // Enhanced for normal text
        AAA_large: ratio >= 4.5,    // Enhanced for large text
      },
      rating: getRating(ratio),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: parse hex to RGB object
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

// Helper: WCAG relative luminance
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper: contrast ratio
function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Helper: human-readable rating
function getRating(ratio) {
  if (ratio >= 7) return 'Excellent';
  if (ratio >= 4.5) return 'Good';
  if (ratio >= 3) return 'Fair';
  return 'Poor';
}

module.exports = router;
