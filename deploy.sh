#!/bin/bash
# ===========================================
# SECUREPENT PRODUCTION DEPLOYMENT SCRIPT
# ===========================================
# Server: 78.109.17.223
# Domain: securepent.com
# ===========================================

set -e

echo "========================================"
echo "   SECUREPENT PRODUCTION DEPLOYMENT"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}Note: Some commands may require sudo${NC}"
fi

# ===========================================
# Step 1: Check Prerequisites
# ===========================================
echo -e "${GREEN}[1/6]${NC} Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    exit 1
fi

echo "  ✓ Docker installed"
echo "  ✓ Docker Compose installed"

# ===========================================
# Step 2: Check Environment File
# ===========================================
echo -e "${GREEN}[2/6]${NC} Checking environment configuration..."

if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "  Please copy env.production.template to .env and configure it:"
    echo "    cp env.production.template .env"
    echo "    nano .env"
    exit 1
fi

# Check required variables
source .env
if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" == "CHANGE_ME_TO_A_STRONG_PASSWORD" ]; then
    echo -e "${RED}Error: DB_PASSWORD not set in .env${NC}"
    exit 1
fi

if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" == "CHANGE_ME_TO_A_VERY_LONG_RANDOM_STRING_AT_LEAST_64_CHARACTERS" ]; then
    echo -e "${RED}Error: JWT_SECRET not set in .env${NC}"
    exit 1
fi

echo "  ✓ Environment configured"

# ===========================================
# Step 3: Check SSL Certificates
# ===========================================
echo -e "${GREEN}[3/6]${NC} Checking SSL certificates..."

if [ ! -f "/etc/letsencrypt/live/securepent.com/fullchain.pem" ]; then
    echo -e "${YELLOW}Warning: SSL certificates not found!${NC}"
    echo "  Run the following to generate certificates:"
    echo "    sudo certbot certonly --standalone -d securepent.com -d www.securepent.com"
    echo ""
    read -p "Continue without SSL? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "  ✓ SSL certificates found"
fi

# ===========================================
# Step 4: Stop Existing Containers
# ===========================================
echo -e "${GREEN}[4/6]${NC} Stopping existing containers..."

docker compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true

echo "  ✓ Containers stopped"

# ===========================================
# Step 5: Build and Start
# ===========================================
echo -e "${GREEN}[5/6]${NC} Building and starting containers..."

docker compose -f docker-compose.prod.yml up --build -d

echo "  ✓ Containers started"

# ===========================================
# Step 6: Health Check
# ===========================================
echo -e "${GREEN}[6/6]${NC} Running health checks..."

sleep 10

# Check if containers are running
if docker ps | grep -q securepent_frontend; then
    echo "  ✓ Frontend container running"
else
    echo -e "${RED}  ✗ Frontend container not running${NC}"
fi

if docker ps | grep -q securepent_api; then
    echo "  ✓ API container running"
else
    echo -e "${RED}  ✗ API container not running${NC}"
fi

if docker ps | grep -q securepent_db; then
    echo "  ✓ Database container running"
else
    echo -e "${RED}  ✗ Database container not running${NC}"
fi

# Test API health
API_HEALTH=$(curl -s http://localhost:80/api/health 2>/dev/null || echo "failed")
if [[ "$API_HEALTH" == *"status"* ]]; then
    echo "  ✓ API responding"
else
    echo -e "${YELLOW}  ⚠ API not responding yet (may still be starting)${NC}"
fi

echo ""
echo "========================================"
echo "   DEPLOYMENT COMPLETE!"
echo "========================================"
echo ""
echo "  Website:  https://securepent.com"
echo "  Admin:    https://securepent.com/sp-admin-portal-x7k9m2"
echo ""
echo "  Commands:"
echo "    View logs:     docker compose -f docker-compose.prod.yml logs -f"
echo "    Stop:          docker compose -f docker-compose.prod.yml down"
echo "    Restart:       docker compose -f docker-compose.prod.yml restart"
echo ""
