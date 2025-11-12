#!/bin/sh

# Start backend server in the background
echo "Starting backend server..."
node /usr/src/app/dist/server.js &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 2

# Start nginx (entrypoint.sh handles nginx configuration)
echo "Starting nginx..."
exec /entrypoint.sh
