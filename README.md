# 🦁 WildEye — Real-Time Wildlife Detection System
### YOLOv8 · FastAPI · React · WebSocket · Multi-Camera AI Surveillance

---

## 🚀 Quick Start (Frontend Only — Works Immediately)

The frontend runs completely standalone with realistic simulated data.
No backend needed to see the full UI experience.

```bash
cd wild/frontend
npm install
npm run dev
```
Open: http://localhost:3000

**Demo Credentials:**
- Admin: `admin@wildeye.ai` / `admin123`
- Ranger: `ranger@wildeye.ai` / `ranger123`

---

## 📁 Full Project Structure

```
wild/
├── frontend/                    # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # 3D animated forest homepage
│   │   │   ├── LoginPage.jsx    # Auth pages
│   │   │   ├── SignupPage.jsx
│   │   │   ├── LiveFeedPage.jsx # Camera feeds with YOLO overlay
│   │   │   ├── AlertsPage.jsx   # Alert management
│   │   │   ├── DetectionPage.jsx# Detection log table
│   │   │   ├── LocationPage.jsx # Map tracking
│   │   │   └── AnalyticsPage.jsx# Charts & insights
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── DashboardLayout.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.jsx
│   │   ├── utils/
│   │   │   └── mockData.js
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                     # FastAPI Python
│   ├── main.py                  # App entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── app/
│       ├── api/
│       │   ├── auth.py
│       │   ├── detections.py
│       │   ├── cameras.py
│       │   ├── alerts.py
│       │   └── websocket.py     # Real-time streaming
│       ├── models/
│       │   └── schemas.py
│       └── services/
│           └── yolo_service.py  # YOLOv8 integration
│
└── docker-compose.yml           # Full stack deployment
```

---

## 🖥️ VS Code Setup Guide

### Prerequisites
Install these first:
- [Node.js 20+](https://nodejs.org/)
- [Python 3.11+](https://python.org/)
- [VS Code](https://code.visualstudio.com/)

### Recommended VS Code Extensions
Install these in VS Code (Ctrl+Shift+X):
- `ES7+ React/Redux/React-Native snippets`
- `Tailwind CSS IntelliSense`
- `Python`
- `Pylance`
- `REST Client`

---

## 🎯 Frontend Setup (Step by Step)

```bash
# 1. Open terminal in VS Code (Ctrl+`)

# 2. Navigate to frontend
cd wild/frontend

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

That's it! The frontend has full simulation built-in.

---

## ⚙️ Backend Setup (Optional — for full API)

```bash
# 1. Open a new terminal

# 2. Navigate to backend
cd wild/backend

# 3. Create Python virtual environment
python -m venv venv

# 4. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 5. Install dependencies
pip install -r requirements.txt

# 6. Copy environment file
cp .env.example .env

# 7. Start the API server
python main.py
# OR
uvicorn main:app --reload --port 8000

# API Docs: http://localhost:8000/docs
# WebSocket: ws://localhost:8000/ws/detections
```

---

## 🐳 Docker (Full Stack)

```bash
cd wild
docker-compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- MongoDB: localhost:27017

---

## 🤖 YOLOv8 Integration

The system uses YOLOv8 for detection. To enable real detection:

```bash
cd wild/backend

# Install PyTorch (CPU)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install Ultralytics
pip install ultralytics

# Download YOLOv8 model (auto-downloads on first run)
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

In `.env`:
```
YOLO_MODEL_PATH=yolov8n.pt
YOLO_CONFIDENCE=0.5
```

---

## 📡 WebSocket Events

Connect to `ws://localhost:8000/ws/detections` to receive:

```json
{
  "type": "detection",
  "data": {
    "id": "DET-A1B2C3D4",
    "animal": "Tiger",
    "confidence": 94,
    "camera": "CAM-001",
    "danger": true,
    "trackId": "TRK-5821",
    "timestamp": "2024-01-15T14:30:00",
    "bbox": { "x": 120, "y": 80, "w": 180, "h": 200 }
  }
}
```

---

## 🎨 UI Features

| Page | Features |
|------|----------|
| **Home** | 3D animated forest, fireflies, moving animals, radar widget |
| **Login/Signup** | Glassmorphism, demo credentials, role selection |
| **Live Feed** | 3-camera canvas simulation, YOLO bounding boxes, detection panel |
| **Alerts** | Real-time alerts, severity filter, acknowledge system |
| **Detections** | Full sortable table, CSV export, live updating |
| **Locations** | SVG tracking map, animal path tracking, camera zones |
| **Analytics** | Area charts, bar charts, pie charts, KPI cards |

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd wild/frontend
npm install -g vercel
vercel --prod
```

### Backend → Railway / Render
```bash
# Push to GitHub, then connect to Railway.app
# Set environment variables in Railway dashboard
```

---

## 🔧 Troubleshooting

**`npm install` fails:**
```bash
npm install --legacy-peer-deps
```

**Port 3000 already in use:**
```bash
# Change port in vite.config.js
server: { port: 3001 }
```

**Python venv issues on Windows:**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**YOLO model download fails:**
```bash
# Manual download
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
```

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion |
| Charts | Recharts |
| Routing | React Router v6 |
| Backend | FastAPI, Python 3.11 |
| AI | YOLOv8 (Ultralytics) |
| Tracking | DeepSORT / ByteTrack |
| Database | PostgreSQL + MongoDB + Redis |
| WebSocket | FastAPI WebSockets |
| Deployment | Vercel (FE) + Docker (BE) |

---

Built with ❤️ by WildEye AI Team · Senior Production Grade
