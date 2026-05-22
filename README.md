# 🌀 AtmosIQ — Next-Generation Climate Intelligence Platform

AtmosIQ is an enterprise-grade, high-fidelity AI-powered climate intelligence engine providing real-time environmental telemetry, deep air quality indices, and predictive weather simulation analytics. Built using Vite, React, Node.js, Express, and Google Gemini AI model orchestration.

## 📁 Project Structure

### 🌐 Frontend (`/frontend`)
- **`src/components/`**: Reusable UI components (Glassmorphism, AI Orb).
- **`src/pages/`**: Main application views (Dashboard, Travel, Radar).
- **`src/hooks/`**: Custom React hooks for state and data fetching.
- **`src/assets/`**: Static assets and global styles.

### ⚙️ Backend (`/backend`)
- **`src/config/`**: Database and infrastructure configuration.
- **`src/controllers/`**: API request handlers.
- **`src/middleware/`**: Security, validation, and error handlers.
- **`src/models/`**: Mongoose schemas (User, Alert, RiskProfile).
- **`src/routes/`**: API route definitions.
- **`src/services/`**: Core business logic (Weather orchestration, Gemini AI).
- **`src/sockets/`**: Real-time event management.
- **`src/utils/`**: Helper functions and Logger (Pino).
- **`src/validators/`**: Zod validation schemas.

### 🤖 AI Engine (`/ai-engine`)
- **`app.py`**: Python Flask service for advanced environmental analysis.

---

## 🛠️ Setup & Deployment

### Environment Variables
Ensure you have a `.env` in both `/backend` and `/frontend` directories. See `.env.example` at root.

### Running Locally
1. **Backend**: `cd backend && npm install && npm run dev`
2. **Frontend**: `cd frontend && npm install && npm run dev`

### Deployment
- **Frontend**: Optimized for Vercel/Netlify.
- **Backend**: Ready for Render/Heroku/AWS with Docker support.

---

## 🌲 Folder Tree Structure
```text
.
├── ai-engine/
│   └── app.py
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   └── validators/
│   ├── server.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── assets/
│   └── vite.config.js
└── README.md
```
