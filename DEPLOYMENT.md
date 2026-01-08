# SecurePent - Deployment Guide

This guide covers deploying the SecurePent website with full backend functionality.

---

## Quick Start (Development)

### 1. Prerequisites

- **Node.js 20+** (required for Vite 7)
- **PostgreSQL 14+**
- **npm** or **yarn**

### 2. Database Setup

```bash
# Create PostgreSQL database
sudo -u postgres psql

# In psql:
CREATE DATABASE securepent_db;
CREATE USER securepent WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE securepent_db TO securepent;
\c securepent_db
GRANT ALL ON SCHEMA public TO securepent;
\q
```

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database schema
npm run db:init

# Seed with demo data (optional)
npm run db:seed

# Start development server
npm run dev
```

### 4. Frontend Setup

```bash
# Navigate to frontend root
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001
- **API Health**: http://localhost:3001/api/health

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@securepent.com | SecureAdmin2026! |
| Demo Client | demo@securepent.com | demo123 |

---

## Production Deployment

### Option 1: Docker Compose (Recommended)

```bash
# Create production environment file
cat > .env << EOF
DB_PASSWORD=your_very_secure_database_password
JWT_SECRET=your_production_jwt_secret_minimum_32_characters
FRONTEND_URL=https://yourdomain.com
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-smtp-password
NOTIFICATION_EMAIL=leads@yourdomain.com
EOF

# Build and start all services
docker-compose up -d --build

# Initialize database
docker-compose exec api npm run db:init
docker-compose exec api npm run db:seed

# View logs
docker-compose logs -f
```

### Option 2: Manual Deployment

#### Backend (Node.js)

```bash
cd server

# Install production dependencies
npm ci --only=production

# Set environment variables
export NODE_ENV=production
export DATABASE_URL=postgresql://user:pass@host:5432/db
export JWT_SECRET=your_production_secret
# ... other env vars

# Start with PM2 (recommended)
npm install -g pm2
pm2 start src/index.js --name securepent-api

# Or with systemd
# Create /etc/systemd/system/securepent-api.service
```

#### Frontend (Static Build)

```bash
# Build for production
npm run build

# The 'dist' folder contains static files
# Serve with nginx, Apache, or any static host
```

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API server port (default: 3001) |
| `NODE_ENV` | No | Environment (development/production) |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | Secret for JWT signing (min 32 chars) |
| `JWT_EXPIRES_IN` | No | Token expiration (default: 7d) |
| `FRONTEND_URL` | **Yes** | CORS allowed origin |
| `SMTP_HOST` | No | Email server host |
| `SMTP_PORT` | No | Email server port |
| `SMTP_USER` | No | Email username |
| `SMTP_PASS` | No | Email password |
| `NOTIFICATION_EMAIL` | No | Where to send lead notifications |

### Frontend (Vite)

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3001/api
```

For production:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Database Management

### View Tables

```bash
docker-compose exec postgres psql -U securepent -d securepent_db -c "\dt"
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U securepent securepent_db > backup.sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U securepent securepent_db < backup.sql
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

### Update nginx.conf for HTTPS

Add to your server block:
```nginx
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
```

---

## Monitoring & Logging

### Health Checks

- **API Health**: `GET /api/health`
- **Readiness**: `GET /api/health/ready`
- **Liveness**: `GET /api/health/live`

### View Logs

```bash
# Docker logs
docker-compose logs -f api

# PM2 logs
pm2 logs securepent-api
```

---

## Security Checklist

- [ ] Change default database password
- [ ] Generate strong JWT secret (32+ chars)
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure email for lead notifications
- [ ] Regular database backups
- [ ] Monitor audit logs

---

## Troubleshooting

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres
```

### API Returns 500 Errors

```bash
# Check API logs
docker-compose logs api

# Verify database initialization
docker-compose exec api npm run db:init
```

### CORS Errors

Ensure `FRONTEND_URL` in `.env` matches your frontend domain exactly.

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/session` | GET | Verify session |
| `/api/auth/logout` | POST | Logout |
| `/api/leads` | POST | Submit contact form |
| `/api/leads` | GET | List leads (admin) |
| `/api/cookies/preferences` | POST | Save cookie consent |
