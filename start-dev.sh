#!/bin/bash

# Start Script for SecurePent
# Starts both frontend and backend in development mode

echo "🔒 Starting SecurePent Services..."

# Check if .env exists
if [ ! -f server/.env ]; then
    echo "⚠️  server/.env not found, creating from example..."
    cp server/.env.example server/.env
fi

# Install dependencies if node_modules missing
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server && npm install && cd ..
fi

# Function to handle cleanup
cleanup() {
    echo -e "\n🛑 Stopping services..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup SIGINT

# Start Backend
echo "🚀 Starting Backend API (Port 3001)..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend
sleep 2

# Start Frontend
echo "🌐 Starting Frontend (Port 5173)..."
npm run dev &
FRONTEND_PID=$!

# Initial database check
# This is non-blocking
echo "🐘 Connecting to database..."
cd server && npm run db:init > /dev/null 2>&1 &
cd ..

wait
