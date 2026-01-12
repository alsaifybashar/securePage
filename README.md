# 🔒 SecurePent - Offensive Security Platform

<div align="center">

![SecurePent](https://img.shields.io/badge/SecurePent-Cybersecurity-00d4aa?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**A premium, secure cybersecurity company website with integrated analytics, lead management, and admin dashboard.**

🌐 **Live**: [https://securepent.com](https://securepent.com)

</div>

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Production Deployment](#-production-deployment)
- [Features](#-features)
- [Architecture](#-architecture)
- [Admin Dashboard](#-admin-dashboard)
- [API Reference](#-api-reference)
- [Security](#-security-features)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Local Development

**Prerequisites**: Node.js 20+, Docker & Docker Compose

#### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/alsaifybashar/securePage.git
cd securePage

# Start all services
docker compose up --build -d

# View logs
docker compose logs -f
```

**Access**:
- 🌐 **Website**: http://localhost:8080
- 🔐 **Admin**: http://localhost:8080/sp-admin-portal-x7k9m2
- 📊 **API Health**: http://localhost:8080/api/health

#### Option 2: Development Mode (Hot Reload)

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

**Access**:
- 🌐 **Website**: http://localhost:5173
- 🔐 **Admin**: http://localhost:5173/sp-admin-portal-x7k9m2

---

## 🌐 Production Deployment

### Server Requirements

- **OS**: Ubuntu 22.04+ / Debian 12+
- **Docker**: v20+
- **Docker Compose**: v2+
- **Domain**: DNS pointing to server IP
- **SSL**: Let's Encrypt (automated)

### Deployment Steps

```bash
# 1. SSH into your server
ssh user@78.109.17.223

# 2. Clone repository
cd /opt
git clone https://github.com/alsaifybashar/securePage.git securepent
cd securepent

# 3. Generate SSL certificates
sudo certbot certonly --standalone \
  -d securepent.com \
  -d www.securepent.com

# 4. Configure environment
cp env.production.template .env
nano .env  # Set passwords and secrets

# 5. Deploy
chmod +x deploy.sh
./deploy.sh
```

### Environment Variables (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_PASSWORD` | ✅ | PostgreSQL password |
| `JWT_SECRET` | ✅ | JWT signing key (64+ chars) |
| `SMTP_HOST` | ❌ | Email server for notifications |
| `SMTP_PORT` | ❌ | SMTP port (usually 587) |
| `SMTP_USER` | ❌ | Email username |
| `SMTP_PASS` | ❌ | Email password |
| `NOTIFICATION_EMAIL` | ❌ | Recipient for contact forms |
| `VITE_CLARITY_PROJECT_ID` | ❌ | Microsoft Clarity ID |

**Generate secure values:**
```bash
# Database password
openssl rand -base64 32

# JWT secret
openssl rand -base64 64
```

---

## ✨ Features

### 🌐 Public Website

| Feature | Description |
|---------|-------------|
| **Premium Dark Theme** | Modern, high-tech aesthetic with glassmorphism |
| **Fully Responsive** | Optimized for mobile, tablet, and desktop |
| **GDPR Cookie Consent** | Compliant banner with preference management |
| **Secure Contact Form** | Multi-layer validation and sanitization |
| **Smooth Navigation** | Single-page scroll with animated sections |
| **Microsoft Clarity** | Heatmaps and session recordings (consent-based) |

### 🔐 Admin Dashboard

| Feature | Description |
|---------|-------------|
| **Analytics Overview** | Visitors, page views, session duration |
| **Lead Management** | View, filter, and manage contact submissions |
| **Traffic Insights** | Device types, browsers, geographic data |
| **Audit Logging** | All admin actions tracked |
| **Settings** | Change username and password |

### 🛡️ Security

| Feature | Description |
|---------|-------------|
| **Input Sanitization** | XSS and SQL injection prevention |
| **Rate Limiting** | DDoS and brute force protection |
| **Argon2id Hashing** | Industry-leading password security |
| **JWT Authentication** | Secure token-based sessions |
| **Security Headers** | HSTS, CSP, X-Frame-Options |
| **Account Lockout** | Auto-lock after failed attempts |

---

## 🏗️ Architecture

```
                     ┌─────────────────────────────────────┐
                     │           INTERNET                   │
                     │    https://securepent.com           │
                     └───────────────┬─────────────────────┘
                                     │
                     ┌───────────────▼─────────────────────┐
                     │      NGINX (Port 80/443)            │
                     │  • SSL Termination                  │
                     │  • Static Files                     │
                     │  • Reverse Proxy → /api             │
                     │  • Security Headers                 │
                     └───────────────┬─────────────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
          ▼                          ▼                          ▼
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│  Static Files   │     │   API Server        │     │   PostgreSQL    │
│  (React SPA)    │     │   (Node.js:3001)    │     │   (Port 5432)   │
│                 │     │                     │     │                 │
│  • index.html   │     │  • /api/auth        │     │  • users        │
│  • CSS/JS       │     │  • /api/leads       │     │  • leads        │
│  • Assets       │     │  • /api/health      │     │  • sessions     │
│                 │     │  • /api/cookies     │     │  • audit_log    │
└─────────────────┘     └─────────────────────┘     └─────────────────┘
```

### Docker Services

| Container | Image | Purpose |
|-----------|-------|---------|
| `securepent_frontend` | nginx:alpine | Serves React app, proxies API |
| `securepent_api` | node:20-alpine | Express.js API server |
| `securepent_db` | postgres:16-alpine | PostgreSQL database |

---

## 🔐 Admin Dashboard

### Access

| Environment | URL |
|-------------|-----|
| **Production** | https://securepent.com/sp-admin-portal-x7k9m2 |
| **Local Docker** | http://localhost:8080/sp-admin-portal-x7k9m2 |
| **Development** | http://localhost:5173/sp-admin-portal-x7k9m2 |

### Default Credentials

| Field | Value |
|-------|-------|
| **Email** | `admin@securepent.com` |
| **Password** | `admin123` |

> ⚠️ **IMPORTANT**: Change password immediately after first login!

### Reset Admin Password

If locked out or forgot password:

```bash
# Delete admin and let system recreate
docker exec -it securepent_db psql -U securepent -d securepent_db \
  -c "DELETE FROM users WHERE email = 'admin@securepent.com';"

# Restart API to recreate admin
docker compose -f docker-compose.prod.yml restart api

# Wait for initialization
sleep 15

# Login with: admin@securepent.com / admin123
```

---

## 📡 API Reference

### Public Endpoints

#### Health Check
```http
GET /api/health

Response 200:
{
  "status": "healthy",
  "timestamp": "2026-01-12T22:00:00.000Z",
  "uptime": 3600,
  "database": { "status": "connected" }
}
```

#### Submit Lead (Contact Form)
```http
POST /api/leads
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@company.com",
  "company": "ACME Corp",
  "message": "We need a security audit..."
}

Response 201:
{
  "success": true,
  "message": "Lead submitted successfully"
}
```

### Protected Endpoints

All require `Authorization: Bearer <token>` header.

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@securepent.com",
  "password": "admin123"
}

Response 200:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "uuid", "email": "admin@securepent.com", "role": "admin" }
}
```

#### Get Leads
```http
GET /api/leads
Authorization: Bearer <token>

Response 200:
{
  "leads": [...],
  "total": 42
}
```

---

## 🛡️ Security Features

### Password Security

- **Algorithm**: Argon2id (winner of Password Hashing Competition)
- **Memory Cost**: 64MB
- **Time Cost**: 3 iterations
- **Parallelism**: 4 threads

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 15 minutes |
| Login | 5 attempts | 15 minutes |

### Security Headers (Production)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' https://www.clarity.ms; ...
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### CORS

Production only allows:
- `https://securepent.com`
- `https://www.securepent.com`

---

## ⚙️ Configuration

### File Structure

```
securePage/
├── docker-compose.yml          # Local development
├── docker-compose.prod.yml     # Production deployment
├── nginx.conf                  # Production Nginx (HTTPS)
├── nginx.local.conf            # Local Nginx (HTTP)
├── Dockerfile.frontend         # Frontend container
├── deploy.sh                   # Production deployment script
├── env.production.template     # Environment template
│
├── src/                        # React Frontend
│   ├── components/             # UI Components
│   ├── pages/admin/            # Admin Dashboard
│   ├── services/               # API & Analytics
│   └── utils/                  # Security utilities
│
└── server/                     # Node.js Backend
    ├── src/
    │   ├── routes/             # API Routes
    │   ├── db/                 # Database (Pool, Init)
    │   ├── services/           # Business Logic
    │   └── middleware/         # Express Middleware
    ├── Dockerfile              # API Container
    └── entrypoint.sh           # Startup script
```

### Key Files

| File | Purpose |
|------|---------|
| `docker-compose.prod.yml` | Production orchestration |
| `nginx.conf` | HTTPS configuration with SSL |
| `server/src/db/init.js` | Database schema & admin user |
| `server/src/routes/auth.js` | Authentication logic |
| `src/services/clarity.js` | Microsoft Clarity integration |

---

## 🔍 Troubleshooting

### Frontend Not Loading

```bash
# Check container status
docker ps

# View frontend logs
docker logs securepent_frontend
```

### API Errors (500)

```bash
# View API logs
docker compose -f docker-compose.prod.yml logs api --tail=100
```

### Database Connection Issues

```bash
# Check database
docker logs securepent_db

# Connect manually
docker exec -it securepent_db psql -U securepent -d securepent_db

# List users
SELECT email, name, role FROM users;
```

### Port Already In Use

```bash
# Find process using port 80
sudo lsof -i :80

# Stop conflicting service
sudo systemctl stop nginx  # or apache2
```

### SSL Certificate Issues

```bash
# Renew certificates
docker compose -f docker-compose.prod.yml down
sudo certbot renew
docker compose -f docker-compose.prod.yml up -d
```

### Complete Reset

```bash
# WARNING: Deletes all data!
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up --build -d
```

---

## 📊 Analytics (Microsoft Clarity)

### Setup

1. Create project at [clarity.microsoft.com](https://clarity.microsoft.com)
2. Copy Project ID
3. Add to `.env`:
   ```
   VITE_CLARITY_PROJECT_ID=your_project_id
   ```
4. Rebuild: `docker compose up --build -d`

### GDPR Compliance

- Clarity only activates when user accepts **Statistics** cookies
- No tracking before consent
- Users can change preferences anytime

---

## 🚀 Management Commands

### Production

```bash
# View all logs
docker compose -f docker-compose.prod.yml logs -f

# Restart services
docker compose -f docker-compose.prod.yml restart

# Stop everything
docker compose -f docker-compose.prod.yml down

# Update and redeploy
git pull origin main
docker compose -f docker-compose.prod.yml up --build -d
```

### Database

```bash
# Connect to database
docker exec -it securepent_db psql -U securepent -d securepent_db

# View leads
SELECT * FROM leads ORDER BY submitted_at DESC LIMIT 10;

# View users
SELECT id, email, name, role FROM users;
```

---

## 📜 License

MIT License - Use freely for your projects.

---

<div align="center">

**Built with 🔒 security-first mindset**

[🌐 Live Site](https://securepent.com) • [🐛 Report Bug](https://github.com/alsaifybashar/securePage/issues) • [💡 Request Feature](https://github.com/alsaifybashar/securePage/issues)

</div>
