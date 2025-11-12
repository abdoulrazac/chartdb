#!/bin/sh

# Start backend server in the background, logs go to stdout/stderr
echo "Starting backend server..."
echo "REDIS_URL: ${REDIS_URL:-redis://localhost:6379}"
echo "PORT: ${PORT:-3000}"
node /usr/src/app/dist/server.js &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 3

# Test backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "ERROR: Backend failed to start"
    exit 1
fi

echo "Backend started successfully (PID: $BACKEND_PID)"

# Start nginx (entrypoint.sh handles nginx configuration)
echo "Starting nginx..."
exec /entrypoint.sh
