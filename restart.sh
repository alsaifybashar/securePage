#!/bin/bash
echo "♻️ Restarting SecurePent Docker containers..."

# Stop containers
docker compose down

# Rebuild and start
docker compose up --build
