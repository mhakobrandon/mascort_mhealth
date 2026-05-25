# MASCOT mHealth Project

**Mobile Health (mHealth) Supported Self-Care Among Tertiary Education Students in Zimbabwe**

Youth-centered digital platform supporting HIV and pregnancy prevention for young people in Zimbabwe.

## 📁 Project Structure

```
mascort_mhealth/
├── backend/                    # FastAPI Python backend
│   ├── main.py                # Application entry point
│   ├── models.py              # Database models
│   ├── schemas.py             # Pydantic validation
│   ├── requirements.txt        # Python dependencies
│   ├── docker-compose.yml     # Container setup
│   ├── .env.example           # Environment template
│   ├── routes/                # API endpoints
│   ├── database/              # Database config
│   ├── ai/                    # AI/ML modules
│   ├── tests/                 # Test suite
│   └── README.md              # Backend documentation
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Getting Started

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run development server
python main.py
```

Access API at: http://localhost:8000
- **Swagger Docs:** http://localhost:8000/api/docs
- **API Health:** http://localhost:8000/api/health

### Docker Setup

```bash
cd backend
docker-compose up
```

This starts:
- **API:** http://localhost:8000
- **PostgreSQL:** localhost:5432
- **pgAdmin:** http://localhost:5050 (admin/admin)

## 📚 Documentation

- [Backend README](backend/README.md) - Complete backend setup and API docs
- [Tech Stack Guide](MASCOT_Complete_Tech_Stack.md) - Technology overview
- [Next Steps](MASCOT_Next_Steps_Action_Plan.md) - Implementation roadmap

## 🔧 Technology Stack

- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL + PostGIS
- **AI:** LangChain + OpenAI/Claude
- **Frontend:** React Native + Expo (coming soon)
- **Deployment:** Docker + Heroku/AWS

## 📋 Key Features

✅ **Prevention Methods Directory** - Comprehensive HIV and pregnancy prevention options
✅ **Clinic Finder** - Locate nearby healthcare services with distance calculation
✅ **AI Health Assistant** - RAG-based Q&A for verified health information
✅ **Counselling Booking** - Connect with professional counsellors
✅ **Commodity Distribution** - Discreet request system for prevention items
✅ **Support Groups** - Peer support and community resources
✅ **Testimonials** - Real stories from young people

## 🔐 Security Features

- JWT token authentication
- PostgreSQL data encryption
- CORS protection
- Environment variable management
- SQL injection prevention (SQLAlchemy ORM)
- Password hashing (Argon2)

## 🧪 Testing

```bash
cd backend
pytest
```

## 📊 Database Setup

### PostgreSQL with PostGIS

```bash
# macOS
brew install postgresql postgis

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib postgis

# Windows
# Download from https://www.postgresql.org/download/windows/
# Enable PostGIS during installation
```

### Initialize Database

```bash
createdb mascot_db
psql -d mascot_db -c "CREATE EXTENSION postgis;"
```

## 🌍 Environment Variables

See `backend/.env.example` for complete configuration:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/mascot_db
OPENAI_API_KEY=sk-your-key
JWT_SECRET=min_32_character_secret
ENVIRONMENT=development
```

## 📞 Support

**CeSHHAR Zimbabwe**
- Email: mascot.hackathon@ceshhar.org
- Phone: +263783945058 or 0715540613

## 📄 Hackathon Info

**Event:** MASCOT Hackathon 2026
**Purpose:** Design youth-centered mHealth platform for HIV/pregnancy prevention
**Team Size:** 2-5 people (aged 18-24)
**Requirements:** At least 1 coder, 2+ students
**Date:** May 27-28, 2026
**Application Deadline:** May 19, 2026

## 🎯 Next Steps

1. ✅ Backend project structure created
2. ⬜ Database seeding and migrations
3. ⬜ Frontend React Native app setup
4. ⬜ AI health documents ingestion
5. ⬜ Integration testing
6. ⬜ Docker deployment
7. ⬜ Production deployment

---

**Status:** 🟢 Active Development
**Last Updated:** May 25, 2026
