# 🌀 AtmosIQ — Climate Intelligence Core (Backend)

AtmosIQ Backend is a production-grade, AI-powered environmental intelligence service built with Node.js, Express, and multi-model Google Gemini orchestration.

## 🚀 Features
- **AI Intelligence**: Real-time environmental analysis via Google Gemini 1.5 Flash.
- **Weather Telemetry**: High-precision weather data via Open-Meteo & AQICN.
- **Production Security**: JWT + Refresh Tokens (HTTP-only), RBAC, Helmet, Rate Limiting, Zod Validation.
- **Real-time Engine**: Secure Socket.io for severe weather alerts.
- **Observability**: Structured logging with Pino.
- **Resilience**: Graceful shutdown, database connection retries, and comprehensive error handling.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js 20+
- MongoDB (Local or Atlas)
- Google Gemini API Key
- AQICN Token (Optional, 'demo' works for testing)

### 2. Installation
```bash
cd backend
npm install
```

### 3. Environment Variables
Create a `.env` file based on `.env.example`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/weather-companion
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
GEMINI_API_KEY=your_gemini_key
AQICN_TOKEN=your_aqicn_token
FRONTEND_URL=http://localhost:5173
```

### 4. Running the App
```bash
# Development
npm run dev

# Production
npm start
```

## 🐳 Docker Deployment
```bash
docker build -t weather-backend .
docker run -p 5000:5000 --env-file .env weather-backend
```

## 🧪 Testing
```bash
npm test
```

## 📖 API Documentation (v1)
- `POST /api/v1/auth/register`: Register user
- `POST /api/v1/auth/login`: Login & get access token
- `GET /api/v1/ai/intelligence`: Get AI weather analysis (requires lat/lon or city)
- `POST /api/v1/ai/travel-analysis`: [PROTECTED] Travel safety risk assessment
- `GET /health`: System health status
