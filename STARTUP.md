# MASCOT mHealth — How to Run

## 1. Backend (FastAPI)

```bash
cd backend

# Install dependencies (first time only)
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Configure environment
# Edit .env — set DATABASE_URL and OPENAI_API_KEY

# Start the API server
python main.py
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

**Minimum .env for local dev (no DB, no AI key):**
```
DATABASE_URL=sqlite:///./mascot.db
JWT_SECRET=any_long_random_string_here
OPENAI_API_KEY=sk-your-key-here
ENVIRONMENT=development
```

---

## 2. Web App (React + Vite)

```bash
cd web
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## 3. Flutter Mobile App

Requires Flutter SDK installed: https://docs.flutter.dev/get-started/install

```bash
cd mobile
flutter pub get
flutter run
```

For Android emulator, the API base URL in `lib/services/api_service.dart` is
`http://10.0.2.2:8000` (maps to your localhost). For a physical device, change
it to your machine's local IP (e.g. `http://192.168.1.x:8000`).

---

## Project Structure

```
mascort_mhealth/
├── backend/           FastAPI + SQLAlchemy + RAG
│   ├── main.py        App entry point (all routes registered)
│   ├── models.py      Database models
│   ├── schemas.py     Pydantic validation schemas
│   ├── routes/        auth, prevention, clinics, counselling, ai_assistant
│   ├── ai/            RAG pipeline + health documents
│   └── database/      SQLAlchemy connection
├── mobile/            Flutter app
│   ├── lib/
│   │   ├── main.dart
│   │   ├── theme/     Purple-green MASCOT theme
│   │   ├── models/    Data models
│   │   ├── services/  API client (http package)
│   │   └── screens/   All 8 screens
│   └── pubspec.yaml
└── web/               React + Tailwind web app
    ├── src/
    │   ├── App.tsx
    │   ├── pages/     Home, Prevention, Clinics, AI Chat, Videos, Stories, Supplies
    │   ├── components/ Layout, Navbar
    │   └── services/  Axios API client
    └── package.json
```

---

## Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Anonymous registration (returns JWT) |
| GET | /api/prevention/ | All prevention methods |
| GET | /api/prevention/{id} | Method details |
| GET | /api/clinics/ | All clinics |
| GET | /api/clinics/nearby | Clinics within radius |
| POST | /api/ai/chat | AI health assistant |
| POST | /api/counselling/book | Book counselling session |
| POST | /api/counselling/commodities/ | Request supplies |
