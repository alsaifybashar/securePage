#!/bin/sh
set -e

echo "🚀 Starting SecurePent API..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 5

# Initialize database (creates tables and admin user if needed)
echo "📦 Initializing database..."
node src/db/init.js

# Start the server
echo "✅ Starting server..."
exec node src/index.js
