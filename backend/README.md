# ChartDB Backend API

Simple Express + Redis backend for sharing ChartDB diagrams.

## Prerequisites

- Node.js 20+
- Redis server running locally or remote

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Install and start Redis** (if not already running):

**macOS (Homebrew)**:
```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows**:
Download from https://redis.io/download or use Docker:
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

3. **Configure environment** (optional):
```bash
cp .env.example .env
# Edit .env if needed
```

4. **Start the server**:

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Save Diagram
```
POST /api/diagrams
Content-Type: application/json

{
  "id": "diagram-id",
  "data": { ...diagram object... }
}
```

### Get Diagram
```
GET /api/diagrams/:id
```

### Delete Diagram (optional)
```
DELETE /api/diagrams/:id
```

### Get Diagram TTL
```
GET /api/diagrams/:id/ttl
```

## Configuration

Environment variables in `.env`:

- `REDIS_URL` - Redis connection URL (default: `redis://localhost:6379`)
- `PORT` - Server port (default: `3000`)
- `FRONTEND_URL` - Frontend URL for CORS (default: `http://localhost:5173`)
- `DIAGRAM_TTL` - Diagram expiration time in seconds (default: `2592000` = 30 days)

## Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:3000/health

# Save diagram
curl -X POST http://localhost:3000/api/diagrams \
  -H "Content-Type: application/json" \
  -d '{"id":"test123","data":{"name":"Test Diagram"}}'

# Get diagram
curl http://localhost:3000/api/diagrams/test123
```
