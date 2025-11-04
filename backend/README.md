# TAI Backend

FastAPI backend for the TAI (Tanzania Artificial Intelligence) Developer Assistant.

## Features

- 🤖 AI-powered chat with **dual provider support**:
  - **DigitalOcean GenAI** (Cloud, fast, reliable)
  - **Ollama** (Local LLM, free, private)
- 🔐 JWT-based authentication
- 💬 Chat management (create, list, delete chats)
- 📝 Message history with syntax highlighting support
- 🗄️ PostgreSQL/SQLite database with SQLAlchemy ORM
- 🔄 Redis caching support
- 📊 Comprehensive logging
- 🚀 Developer tools (Code Generator, Debug Assistant, API Helper, CLI Helper)

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL/SQLite with SQLAlchemy
- **Cache**: Redis
- **AI Providers**: 
  - **DigitalOcean GenAI** (Llama 3.1 8B/70B/405B)
  - **Ollama** (Local LLM - Mistral, Llama2, CodeLlama)
- **Auth**: JWT tokens with bcrypt password hashing

## 🚀 AI Provider Setup

TAI supports two AI providers:

1. **DigitalOcean GenAI** (Recommended for production)
   - ✅ Fast, reliable responses
   - ✅ No local resource requirements
   - ✅ Multiple model sizes
   - See [DIGITALOCEAN_SETUP.md](./DIGITALOCEAN_SETUP.md) for setup

2. **Ollama** (Good for development/privacy)
   - ✅ Free and private
   - ✅ Runs locally
   - ❌ Requires 8GB+ RAM
   - ❌ Slower responses

### Quick Start with DigitalOcean GenAI

1. Get API key from [DigitalOcean](https://cloud.digitalocean.com/account/api/tokens)
2. Update `backend/.env`:
   ```env
   AI_PROVIDER=digitalocean
   DIGITALOCEAN_API_KEY=your_api_key_here
   ```
3. Restart backend

See [DIGITALOCEAN_SETUP.md](./DIGITALOCEAN_SETUP.md) for detailed instructions.

## Setup

### Prerequisites

- Python 3.8+
- PostgreSQL
- Redis (optional, for caching)

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Copy `.env` and update the values:
   ```bash
   cp .env .env.local
   # Edit .env.local with your actual values
   ```

5. **Set up database:**
   Make sure PostgreSQL is running and create the database:
   ```sql
   CREATE DATABASE tai_db;
   CREATE USER tai_user WITH PASSWORD 'tai_password';
   GRANT ALL PRIVILEGES ON DATABASE tai_db TO tai_user;
   ```

### Running the Backend

**Development mode:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Production mode:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Testing

Run the test script to verify everything is working:
```bash
python test_backend.py
```

### API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/token` - Login and get access token
- `GET /api/auth/me` - Get current user info

### Chat
- `POST /api/chat/` - Create new chat
- `GET /api/chat/` - List user chats
- `GET /api/chat/{chat_id}` - Get chat with messages
- `POST /api/chat/{chat_id}/messages` - Send message
- `GET /api/chat/{chat_id}/messages` - Get chat messages
- `DELETE /api/chat/{chat_id}` - Delete chat

## Project Structure

```
backend/
├── app/
│   ├── models/          # Database models
│   ├── routers/         # API route handlers
│   ├── services/        # Business logic (AI service)
│   ├── utils/           # Utilities (logging)
│   ├── config.py        # Configuration settings
│   ├── database.py      # Database connection
│   └── __init__.py
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── test_backend.py      # Test script
└── .env                 # Environment variables
```

## Development

### Adding New Features

1. **Models**: Add new SQLAlchemy models in `app/models/`
2. **Routes**: Add new API endpoints in `app/routers/`
3. **Services**: Add business logic in `app/services/`
4. **Utils**: Add utilities in `app/utils/`

### Database Migrations

This project uses SQLAlchemy's `create_all()` for simplicity. For production, consider using Alembic for migrations.

### Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes and error messages.

## Deployment

### Docker

Use the root `docker-compose.yml` to run the entire stack:

```bash
docker-compose up --build
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | Required |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `SECRET_KEY` | JWT secret key | Required |
| `OLLAMA_BASE_URL` | Ollama API URL | `http://localhost:11434` |
| `OLLAMA_MODEL` | Ollama model to use | `mistral` |
| `DEBUG` | Enable debug mode | `False` |

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use meaningful commit messages

## License

MIT License