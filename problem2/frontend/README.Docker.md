# Docker Setup

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

## Build with Docker

Build arguments are passed from the parent docker-compose.yml:

```bash
# Build image
docker build \
  --build-arg VITE_API_URL=${VITE_API_URL:-http://localhost:4000} \
  --build-arg VITE_SOCKET_URL=${VITE_SOCKET_URL:-http://localhost:4000} \
  -t frontend-app .
```

The Dockerfile uses multi-stage build:
- **Build stage**: Installs dependencies and builds the React app
- **Production stage**: Serves the built files with Nginx

## Environment Variables

The following environment variables are used during build:
- `VITE_API_URL`: API endpoint URL (default: http://localhost:4000)
- `VITE_SOCKET_URL`: WebSocket server URL (default: http://localhost:4000)

