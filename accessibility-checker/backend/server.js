/**
 * Accessibility Design Checker - Backend Server
 * Express.js REST API for image analysis and accessibility checks
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const analysisRoutes = require('./routes/analysis');
const contrastRoutes = require('./routes/contrast');
const reportRoutes = require('./routes/report');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/contrast', contrastRoutes);
app.use('/api/report', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Accessibility Checker API is running' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
