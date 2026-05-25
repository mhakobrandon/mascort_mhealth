# MASCOT mHealth Backend

Fast and secure backend API for the MASCOT mHealth platform - supporting HIV and pregnancy prevention for young people in Zimbabwe.

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- PostgreSQL 14+
- Git

### Installation

1. **Clone and navigate to backend:**
```bash
cd mascort_mhealth/backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Setup environment variables:**
```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

5. **Create database:**
```bash
# Make sure PostgreSQL is running, then:
python -c "from database.connection import init_db; init_db()"
```

6. **Run the server:**
```bash
python main.py
```

Server will be available at `http://localhost:8000`

## 📚 API Documentation

Once running, access interactive docs:
- **Swagger UI:** http://localhost:8000/api/docs
- **ReDoc:** http://localhost:8000/api/redoc
- **OpenAPI JSON:** http://localhost:8000/api/openapi.json

## 🐳 Docker Setup

### Using Docker Compose (Easiest)

```bash
# Start all services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f api

# Access API
http://localhost:8000
http://localhost:5050  # pgAdmin (admin/admin)
```

### Manual Docker

```bash
# Build image
docker build -t mascot-api .

# Run container
docker run -e DATABASE_URL=postgresql://... -p 8000:8000 mascot-api
```

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── models.py              # SQLAlchemy database models
├── schemas.py             # Pydantic validation schemas
├── requirements.txt       # Python dependencies
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Multi-container orchestration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── routes/                # API route handlers
│   ├── prevention.py      # Prevention methods endpoints
│   ├── clinics.py         # Clinic finder endpoints
│   ├── counselling.py     # Counselling booking endpoints
│   ├── ai_assistant.py    # AI health assistant endpoints
│   └── auth.py            # User authentication endpoints
├── database/              # Database configuration
│   └── connection.py      # PostgreSQL connection setup
├── ai/                    # AI/ML modules
│   ├── rag_pipeline.py    # RAG for health Q&A
│   └── health_documents/  # Health guideline documents
└── tests/                 # Test suite
    ├── test_prevention.py
    ├── test_clinics.py
    └── test_ai.py
```

## 🔌 API Endpoints

### Prevention Methods
- `GET /api/prevention/` - Get all prevention methods
- `GET /api/prevention/{method_id}` - Get method details
- `GET /api/prevention/search/?query=...` - Search methods
- `GET /api/prevention/category/{category}` - Filter by category

### Clinics & Services
- `GET /api/clinics/` - Get all clinics
- `GET /api/clinics/nearby?latitude=...&longitude=...` - Find nearby clinics
- `GET /api/clinics/{clinic_id}` - Get clinic details
- `GET /api/clinics/groups/` - Get support groups

### Counselling
- `POST /api/counselling/book` - Book counselling session
- `GET /api/counselling/available` - Get available counsellors

### AI Assistant
- `POST /api/ai/chat` - Chat with health assistant
- `GET /api/ai/history` - Get conversation history

### Authentication
- `POST /api/auth/register` - Register anonymous user
- `GET /api/auth/session/{user_id}` - Get user session

## 🧪 Testing

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_prevention.py

# Run with coverage
pytest --cov=. tests/

# Run with verbose output
pytest -v
```

## 🔑 Environment Variables

See `.env.example` for complete list. Key variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mascot_db
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your_secret_minimum_32_chars
ENVIRONMENT=development
```

## 🚀 Deployment

### Heroku
```bash
# Install Heroku CLI, then:
heroku create mascot-api
git push heroku main
heroku config:set DATABASE_URL=postgresql://...
```

### AWS / DigitalOcean
```bash
# Build and push Docker image
docker build -t mascot-api:latest .
docker push your-registry/mascot-api:latest
```

## 📝 Database Schema

### Key Tables
- **users** - Anonymous user sessions
- **prevention_methods** - HIV/pregnancy prevention options
- **clinics** - Healthcare service providers
- **counsellors** - Professional counsellors
- **support_groups** - Peer support groups
- **ai_conversations** - AI assistant chats
- **commodity_requests** - Prevention item requests
- **user_engagement** - Analytics tracking

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -m 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Open Pull Request

## 📄 License

This project is part of the MASCOT study at CeSHHAR Zimbabwe.

## 🆘 Support

For issues or questions:
- Email: mascot.hackathon@ceshhar.org
- Phone: +263783945058 or 0715540613

---

**Last Updated:** May 2026
**Project Status:** Under Development
