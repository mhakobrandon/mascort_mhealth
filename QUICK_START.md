"""
MASCOT mHealth Backend - Quick Reference

This file provides quick commands and setup references for the MASCOT mHealth backend.
"""

# =============================================================================
# 1. INITIAL SETUP
# =============================================================================

# Navigate to backend directory
cd backend

# Create Python virtual environment
python3.11 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
cp .env.example .env
# Edit .env with your configuration

# =============================================================================
# 2. DATABASE SETUP
# =============================================================================

# Create PostgreSQL database
createdb mascot_db

# Enable PostGIS extension
psql -d mascot_db -c "CREATE EXTENSION postgis;"

# Initialize database tables
python -c "from database.connection import init_db; init_db()"

# =============================================================================
# 3. RUNNING THE APPLICATION
# =============================================================================

# Run development server
python main.py

# Run with hot reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run with custom log level
uvicorn main:app --log-level debug

# =============================================================================
# 4. DOCKER COMMANDS
# =============================================================================

# Build Docker image
docker build -t mascot-api .

# Run with Docker Compose
docker-compose up

# Stop Docker Compose services
docker-compose down

# View logs
docker-compose logs -f api

# Run specific service
docker-compose up postgres
docker-compose up api

# =============================================================================
# 5. TESTING
# =============================================================================

# Run all tests
pytest

# Run specific test file
pytest tests/test_prevention.py

# Run with verbose output
pytest -v

# Run with coverage report
pytest --cov=. tests/

# Run tests in watch mode (requires pytest-watch)
ptw

# =============================================================================
# 6. DATABASE OPERATIONS
# =============================================================================

# Access PostgreSQL directly
psql -d mascot_db

# Useful SQL commands within psql:
# \dt              - List all tables
# \d table_name    - Describe table structure
# SELECT * FROM users;  - View table contents
# \q               - Exit

# Access via pgAdmin (with Docker Compose)
# URL: http://localhost:5050
# Email: admin@mascot.local
# Password: admin

# =============================================================================
# 7. COMMON TASKS
# =============================================================================

# Check if server is running
curl http://localhost:8000/api/health

# Reset database (caution: deletes all data)
dropdb mascot_db
createdb mascot_db
psql -d mascot_db -c "CREATE EXTENSION postgis;"
python -c "from database.connection import init_db; init_db()"

# View API documentation
# Swagger UI: http://localhost:8000/api/docs
# ReDoc: http://localhost:8000/api/redoc

# =============================================================================
# 8. ENVIRONMENT VARIABLES CHECKLIST
# =============================================================================

# Required variables in .env:
# ✓ DATABASE_URL - PostgreSQL connection string
# ✓ JWT_SECRET - At least 32 characters
# ✓ ENVIRONMENT - development/production
# ✓ OPENAI_API_KEY - For AI health assistant
# ✓ CLAUDE_API_KEY - Alternative AI provider

# =============================================================================
# 9. TROUBLESHOOTING
# =============================================================================

# If port 8000 is already in use:
lsof -i :8000          # Find process
kill -9 <PID>          # Kill process

# If database connection fails:
# 1. Check PostgreSQL is running
# 2. Verify DATABASE_URL in .env
# 3. Ensure database exists: createdb mascot_db

# If migrations fail:
# 1. Drop and recreate database
# 2. Run init_db() again

# =============================================================================
# 10. USEFUL LINKS
# =============================================================================

# FastAPI Docs: https://fastapi.tiangolo.com
# SQLAlchemy Docs: https://docs.sqlalchemy.org
# PostgreSQL Docs: https://www.postgresql.org/docs
# PostGIS Docs: https://postgis.net/documentation

# =============================================================================
# API ENDPOINTS REFERENCE
# =============================================================================

# Health Check
GET  /api/health

# Prevention Methods
GET  /api/prevention/
GET  /api/prevention/{method_id}
GET  /api/prevention/search/?query=...
GET  /api/prevention/category/{category}
GET  /api/prevention/effectiveness/high

# Clinics
GET  /api/clinics/
GET  /api/clinics/nearby?latitude=X&longitude=Y
GET  /api/clinics/{clinic_id}
GET  /api/clinics/groups/

# AI Assistant
POST /api/ai/chat
GET  /api/ai/history

# Counselling
POST /api/counselling/book
GET  /api/counselling/available

# Authentication
POST /api/auth/register
GET  /api/auth/session/{user_id}

# =============================================================================
"""
For detailed documentation, see:
- backend/README.md
- MASCOT_Complete_Tech_Stack.md
- MASCOT_Next_Steps_Action_Plan.md
"""
