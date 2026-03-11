# Accessibility Design Checker

A full-stack web application to check design screenshots for WCAG 2.1 accessibility compliance.

## Features

- **Upload & Analyze** — Upload PNG/JPG design screenshots for instant accessibility analysis
- **Accessibility Score** — 0–100 score based on detected issues
- **Issue Detection** — Color contrast, font size, readability, alt text, button visibility
- **Visual Dashboard** — Charts showing issue breakdown by type and severity
- **AI Suggestions** — Actionable fix recommendations for each issue
- **Contrast Checker** — Test any two colors against WCAG AA/AAA standards
- **Color Blindness Simulator** — Preview designs in protanopia, deuteranopia, tritanopia
- **PDF Report** — One-click downloadable accessibility report
- **Accessibility Tips** — Curated WCAG 2.1 best practices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | Node.js + Express |
| Image Analysis | Jimp |
| PDF Generation | PDFKit |
| Routing | React Router v6 |

## Project Structure

```
accessibility-checker/
├── backend/
│   ├── routes/
│   │   ├── analysis.js     # Image upload + WCAG pixel analysis
│   │   ├── contrast.js     # Color contrast ratio calculator
│   │   └── report.js       # PDF report generator
│   ├── uploads/            # Uploaded images (gitignored)
│   ├── server.js           # Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/           # Reusable UI primitives (Button, Card, Badge...)
    │   │   ├── layout/       # Sidebar + Layout wrapper
    │   │   ├── checker/      # ScoreRing, IssuesList, ColorBlindnessSimulator
    │   │   └── dashboard/    # Recharts chart components
    │   ├── hooks/
    │   │   └── useAnalysis.js  # API hooks for analysis, contrast, report
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── UploadPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ContrastCheckerPage.jsx
    │   │   └── TipsPage.jsx
    │   ├── App.jsx           # Router setup
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Run Backend (Terminal 1)

```bash
cd backend
npm run dev
# Server starts at http://localhost:3001
```

### 4. Run Frontend (Terminal 2)

```bash
cd frontend
npm run dev
# App starts at http://localhost:5173
```

### 5. Open in Browser

Visit `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analysis/upload` | Upload image for analysis |
| POST | `/api/contrast/check` | Check contrast ratio |
| POST | `/api/report/generate` | Generate PDF report |

## Environment

The frontend Vite dev server proxies `/api` and `/uploads` to `http://localhost:3001`.
No `.env` file needed for local development.

## Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the /dist folder
```

### Backend (Railway / Render / Fly.io)
```bash
cd backend
# Set PORT environment variable
npm start
```

Update the Vite proxy in `vite.config.js` to point to your deployed backend URL,
or set `VITE_API_URL` in a `.env` file and update the axios base URL in `src/hooks/useAnalysis.js`.

## WCAG Standards Covered

- **1.1.1** — Non-text Content (Alt Text)
- **1.4.1** — Use of Color
- **1.4.3** — Contrast (Minimum) — AA
- **1.4.4** — Resize Text
- **1.4.6** — Contrast (Enhanced) — AAA
- **1.4.8** — Visual Presentation
- **1.4.11** — Non-text Contrast
- **1.4.12** — Text Spacing
- **2.4.7** — Focus Visible

## License

MIT
