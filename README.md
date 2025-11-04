# TAI - Tanzania Artificial Intelligence Developer Assi### 3. Ollama Setup (Local AI Models)

TAI uses Ollama to run AI models locally instead of relying on external APIs.

**Option A: Automatic Setup (Recommended)**
```bash
# Linux/Mac
chmod +x setup_ollama.sh
./setup_ollama.sh

# Windows PowerShell (run as Administrator)
.\setup_ollama.ps1
```

**Option B: Manual Setup**
1. Install Ollama from https://ollama.ai
2. Start Ollama: `ollama serve`
3. Pull models:
   ```bash
   ollama pull mistral     # Recommended for coding
   ollama pull codellama   # Specialized for code
   ollama pull llama2      # Alternative general model
   ```

**Available Models:**
- `mistral` - General purpose, good for coding (default)
- `codellama` - Specialized for code generation
- `llama2` - Good general purpose model

### 4. Database Setupm focused on programming assistance for Tanzanian and global developers, built with FastAPI and Next.js.

## Project Structure

```
TAI/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── models/    # Database models
│   │   ├── routers/   # API routes
│   │   ├── services/  # Business logic
│   │   └── utils/     # Utilities
│   ├── requirements.txt
│   └── main.py
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── lib/         # API utilities
│   │   └── types/       # TypeScript types
│   └── package.json
├── docker-compose.yml # Development environment
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL
- Redis (optional)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Frontend Setup

```bash
cd ../frontend
npm install
```

### 3. Environment Configuration

**Backend (.env):**
```bash
DATABASE_URL=postgresql://tai_user:tai_password@localhost:5432/tai_db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-super-secret-key-change-this-in-production
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
DEBUG=True
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Database Setup

Create PostgreSQL database:
```sql
CREATE DATABASE tai_db;
CREATE USER tai_user WITH PASSWORD 'tai_password';
GRANT ALL PRIVILEGES ON DATABASE tai_db TO tai_user;
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Features Implemented

### ✅ Backend (FastAPI)
- JWT-based authentication system
- User registration and login
- Chat management (create, list, delete)
- Message handling with AI integration
- PostgreSQL database with SQLAlchemy
- Ollama local LLM integration (Mistral, Llama2, CodeLlama)
- Comprehensive error handling
- Logging utilities

### ✅ Frontend (Next.js)
- Modern chat interface
- Responsive design
- Syntax-highlighted code blocks
- User authentication UI
- Real-time message display
- Programming language selection
- Mobile-friendly sidebar

### 🔄 Database Models
- Users table with authentication
- Chats table for conversations
- Messages table with role-based content

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/token` - Login
- `GET /api/auth/me` - Current user

### Chat
- `POST /api/chat/` - Create chat
- `GET /api/chat/` - List chats
- `GET /api/chat/{id}` - Get chat with messages
- `POST /api/chat/{id}/messages` - Send message
- `DELETE /api/chat/{id}` - Delete chat

## Development Commands

### Backend
```bash
# Run tests
python test_backend.py

# Run with auto-reload
uvicorn main:app --reload

# Run production
uvicorn main:app --workers 4
```

### Frontend
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## Docker Development

```bash
# Run entire stack
docker-compose up --build

# Run backend only
docker-compose up backend

# Run database only
docker-compose up postgres redis
```

## Next Steps

1. **Set up OpenAI API key** in backend/.env
2. **Configure database** connection
3. **Test the application** end-to-end
4. **Deploy to production** (Vercel + Railway/DigitalOcean)

## Technologies Used

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Redis, Ollama
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Axios
- **AI**: Ollama (Local LLM - Mistral, Llama2, CodeLlama)
- **DevOps**: Docker, docker-compose

## Contributing

1. Backend code in `/backend`
2. Frontend code in `/frontend`
3. Follow existing patterns
4. Add tests for new features
5. Update documentation

---

**Built with ❤️ for Tanzanian developers**