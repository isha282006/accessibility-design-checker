const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const analysisRoutes = require("./routes/analysis");
const contrastRoutes = require("./routes/contrast");
const reportRoutes = require("./routes/report");

const app = express();
const PORT = process.env.PORT || 3001;

// =======================
// CORS CONFIG (important)
// =======================

app.use(
  cors({
    origin: "*", // allow frontend from Vercel
    methods: ["GET", "POST"],
  })
);

// =======================
// BODY PARSERS
// =======================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// UPLOADS FOLDER
// =======================

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// =======================
// API ROUTES
// =======================

app.use("/api/analysis", analysisRoutes);
app.use("/api/contrast", contrastRoutes);
app.use("/api/report", reportRoutes);

// =======================
// HEALTH CHECK
// =======================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Accessibility Checker API is running",
  });
});

// =======================
// GLOBAL ERROR HANDLER
// =======================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

// =======================
// START SERVER
// =======================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});