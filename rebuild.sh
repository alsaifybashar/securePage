#!/bin/bash
# Force rebuild of frontend to ensure latest code is deployed

echo "🧹 Cleaning up..."
docker compose -f docker-compose.prod.yml down

echo "🏗️ Rebuilding frontend..."
# Force build of frontend image without cache
docker compose -f docker-compose.prod.yml build --no-cache frontend

echo "🚀 Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo "✅ Done! Please clear your browser cache and refresh."
