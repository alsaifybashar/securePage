# 🔒 SECUREPENT

Professional cybersecurity company website with full-stack infrastructure.

## 🏗️ Architecture

```
Frontend (React + Vite)
     ↓
Nginx (Reverse Proxy + SSL)
     ↓
Backend API (Node.js + Express)
     ↓
PostgreSQL Database
```

## 🚀 Quick Deploy

### Prerequisites
- VPS with Ubuntu 22.04+
- Domain name
- 2GB RAM minimum

### Deploy in 5 minutes:

```bash
# 1. SSH into your VPS
ssh root@YOUR_VPS_IP

# 2. Install Docker
curl -fsSL https://get.docker.com | sh

# 3. Clone repository
cd /opt
git clone https://github.com/YOUR_USERNAME/securePage.git securepent
cd securepent

# 4. Configure environment
cp .env.example .env
nano .env   # Fill in your passwords

# 5. Deploy
docker compose up -d --build
```

Visit `http://YOUR_VPS_IP` 🎉

See `VPS_DEPLOYMENT_GUIDE.md` for full instructions including SSL setup.

---

## 📁 Project Structure

```
securepent/
├── src/                    # Frontend React code
│   ├── components/         # UI components
│   ├── services/           # API client
│   └── utils/              # Security utilities
├── server/                 # Backend API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, logging
│   │   ├── services/       # Business logic
│   │   └── db/             # Database
│   └── Dockerfile
├── docker-compose.yml      # Full-stack orchestration
├── Dockerfile.frontend     # Frontend build
├── nginx.conf              # Web server config
├── .env.example            # Environment template
└── VPS_DEPLOYMENT_GUIDE.md # Deployment guide
```

---

## 🛠️ Local Development

### Frontend:
```bash
npm install
npm run dev
```

### Full stack:
```bash
cp .env.example .env
# Edit .env with your values
docker compose up -d
```

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| XSS Protection | DOMPurify sanitization |
| SQL Injection | Parameterized queries |
| Input Validation | Regex patterns |
| HTTPS | Let's Encrypt SSL |
| Headers | CSP, X-Frame, HSTS |
| Auth | JWT tokens |

---

## 📧 Contact Form

The contact form submits to the backend API which:
1. Validates and sanitizes input
2. Stores lead in PostgreSQL
3. Optionally sends email notification

---

## 📝 License

© 2025 SECUREPENT AB
