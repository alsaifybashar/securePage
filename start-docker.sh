#!/bin/bash

# Configuration
NETWORK_NAME="securepent_network"
DB_Container="securepent_db"
API_Container="securepent_api"
FRONTEND_Container="securepent_frontend"

echo "🚀 Starting SecurePent Deployment (Manual Mode)..."

# 1. Create Network
echo "🌐 Creating network..."
docker network create $NETWORK_NAME 2>/dev/null || echo "   Network already exists."

# 2. Start Database
echo "🐘 Starting Database..."
docker stop $DB_Container 2>/dev/null
docker rm $DB_Container 2>/dev/null
docker run -d \
  --name $DB_Container \
  --network $NETWORK_NAME \
  -p 5433:5432 \
  -e POSTGRES_DB=securepent_db \
  -e POSTGRES_USER=securepent \
  -e POSTGRES_PASSWORD=secure_password_change_me \
  -v securepage_postgres_data:/var/lib/postgresql/data \
  postgres:16-alpine

# Wait for DB to be ready
echo "⏳ Waiting for Database to Initialize..."
sleep 5

# 3. Build and Start Backend API
echo "⚙️  Building and Starting Backend API..."
docker build -t securepent_api_img ./server
docker stop $API_Container 2>/dev/null
docker rm $API_Container 2>/dev/null
docker run -d \
  --name $API_Container \
  --network $NETWORK_NAME \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e DATABASE_URL="postgresql://securepent:secure_password_change_me@$DB_Container:5432/securepent_db" \
  -e DB_SSL=false \
  -e JWT_SECRET="your_super_secret_jwt_key_change_this_in_production_min_32_chars" \
  -e JWT_EXPIRES_IN="7d" \
  -e FRONTEND_URL="http://localhost:8080" \
  securepent_api_img

# 4. Initialize Database Schema
echo "📝 Initializing Database Schema..."
sleep 5 # Wait for API to fully start
docker exec $API_Container npm run db:init
docker exec $API_Container npm run db:seed

# 5. Build and Start Frontend
echo "🖥️  Building and Starting Frontend..."
docker build -f Dockerfile.frontend -t securepent_frontend_img --build-arg VITE_API_URL=http://localhost:3001/api .
docker stop $FRONTEND_Container 2>/dev/null
docker rm $FRONTEND_Container 2>/dev/null
docker run -d \
  --name $FRONTEND_Container \
  --network $NETWORK_NAME \
  -p 8080:80 \
  -p 4433:443 \
  securepent_frontend_img

echo "✅ Deployment Complete!"
echo "   - Frontend: http://localhost:8080"
echo "   - API: http://localhost:3001"
echo "   - Database: localhost:5433"
