# ChartDB Docker Setup

This document provides instructions for running ChartDB using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository and navigate to the project directory**

2. **Configure environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

3. **Start the services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

6. **Stop the services**
   ```bash
   docker-compose down
   ```

### Development Mode

For development with a local Redis instance only:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Then run the frontend and backend locally using npm.

## Configuration

### Environment Variables

The following environment variables can be configured in the `.env` file:

#### Frontend Variables (Build-time)
- `VITE_OPENAI_API_KEY`: OpenAI API key for AI features (optional)
- `VITE_OPENAI_API_ENDPOINT`: Custom OpenAI API endpoint (optional)
- `VITE_LLM_MODEL_NAME`: LLM model name (optional)
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000)
- `VITE_HIDE_CHARTDB_CLOUD`: Hide ChartDB Cloud features (default: false)
- `VITE_DISABLE_ANALYTICS`: Disable analytics (default: false)
- `VITE_APP_URL`: Application URL (optional)
- `VITE_HOST_URL`: Host URL (optional)
- `VITE_IS_CHARTDB_IO`: Is ChartDB.io instance (default: false)

#### Backend Variables (Runtime)
- `PORT`: Backend server port (default: 3000)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost)
- `DIAGRAM_TTL`: Diagram expiration in seconds, 0 = no expiration (default: 0)
- `REDIS_URL`: Redis connection URL (automatically set in Docker Compose)

## Docker Compose Services

### chartdb
The main application service that includes:
- Frontend (served by Nginx on port 80)
- Backend API (Node.js on port 3000)

### redis
Redis cache service for storing diagram data:
- Port: 6379
- Data persisted in `redis-data` volume
- Health checks enabled

## Custom Docker Build

To build and run using Docker directly:

```bash
# Build the image
docker build -t chartdb:latest \
  --build-arg VITE_API_URL=http://localhost:3000 \
  .

# Run the container
docker run -d \
  --name chartdb \
  -p 80:80 \
  -p 3000:3000 \
  -e REDIS_URL=redis://your-redis-host:6379 \
  -e FRONTEND_URL=http://localhost \
  -e DIAGRAM_TTL=0 \
  chartdb:latest
```

## Production Deployment

For production deployments:

1. **Update environment variables**
   ```bash
   # Set production URLs
   VITE_API_URL=https://api.yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   ```

2. **Use a reverse proxy** (recommended)
   - Place Nginx or Traefik in front of the application
   - Enable HTTPS with SSL certificates
   - Configure proper domain names

3. **External Redis** (recommended)
   - Use a managed Redis service for better reliability
   - Update `REDIS_URL` to point to your Redis instance
   - Remove the redis service from docker-compose.yml if using external Redis

4. **Data persistence**
   - Ensure Redis data volume is backed up regularly
   - Consider using Redis persistence (RDB or AOF)

## Troubleshooting

### Port Conflicts
If ports 80 or 3000 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"    # Use port 8080 instead of 80
  - "3001:3000"  # Use port 3001 instead of 3000
```

### Redis Connection Issues
Check Redis is running and healthy:
```bash
docker-compose logs redis
docker-compose exec redis redis-cli ping
```

### Rebuild After Changes
If you modify the code or Dockerfile:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### View Container Status
```bash
docker-compose ps
```

### Access Container Shell
```bash
docker-compose exec chartdb sh
```

## Volumes

- `redis-data`: Persistent storage for Redis data

To remove volumes:
```bash
docker-compose down -v
```

## Network

All services communicate through the `chartdb-network` bridge network.

## License

See the main LICENSE file in the repository.
