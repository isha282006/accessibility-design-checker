const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const analysisRoutes = require('./routes/analysis');
const contrastRoutes = require('./routes/contrast');
const reportRoutes = require('./routes/report');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use('/uploads', express.static(uploadsDir));

app.use('/api/analysis', analysisRoutes);
app.use('/api/contrast', contrastRoutes);
app.use('/api/report', reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Accessibility Checker API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});