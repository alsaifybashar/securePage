# 🚀 SecurePent Production Deployment Guide

**Server:** 78.109.17.223  
**Domain:** securepent.com

---

## Prerequisites

Before deploying, ensure your server has:

1. **Docker** (v20+)
2. **Docker Compose** (v2+)
3. **SSL Certificates** (Let's Encrypt)

### Install Docker (if needed)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

---

## Deployment Steps

### 1. Clone Repository

```bash
cd /opt
git clone https://github.com/your-repo/securePage.git securepent
cd securepent
```

### 2. Generate SSL Certificates

```bash
# Stop any service using port 80
sudo systemctl stop nginx 2>/dev/null || true

# Generate certificates
sudo certbot certonly --standalone \
  -d securepent.com \
  -d www.securepent.com \
  --non-interactive \
  --agree-tos \
  --email admin@securepent.com
```

### 3. Configure Environment

```bash
# Copy template
cp env.production.template .env

# Generate secure passwords
echo "DB_PASSWORD=$(openssl rand -base64 32)" >> .env
echo "JWT_SECRET=$(openssl rand -base64 64)" >> .env

# Edit remaining settings
nano .env
```

**Required settings in `.env`:**

| Variable | Description |
|----------|-------------|
| `DB_PASSWORD` | PostgreSQL password (auto-generated) |
| `JWT_SECRET` | JWT signing key (auto-generated) |
| `SMTP_HOST` | Email server hostname |
| `SMTP_PORT` | Email server port (587 for TLS) |
| `SMTP_USER` | Email username |
| `SMTP_PASS` | Email password/app password |
| `NOTIFICATION_EMAIL` | Recipient for contact form |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity ID |

### 4. Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

Or manually:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

---

## Access Points

| URL | Description |
|-----|-------------|
| https://securepent.com | Public website |
| https://securepent.com/sp-admin-portal-x7k9m2 | Admin dashboard |
| https://securepent.com/api/health | API health check |

---

## Management Commands

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Restart Services

```bash
docker compose -f docker-compose.prod.yml restart
```

### Stop All

```bash
docker compose -f docker-compose.prod.yml down
```

### Update Deployment

```bash
git pull origin main
docker compose -f docker-compose.prod.yml up --build -d
```

### Reset Admin Password

If locked out of admin:

```bash
docker exec -it securepent_api node scripts/reset-admin.js
```

---

## SSL Certificate Renewal

Certificates auto-renew with certbot. Verify with:

```bash
sudo certbot renew --dry-run
```

For manual renewal:

```bash
docker compose -f docker-compose.prod.yml down
sudo certbot renew
docker compose -f docker-compose.prod.yml up -d
```

---

## Security Checklist

Before going live:

- [ ] Changed default admin password (admin/admin123)
- [ ] Set strong DB_PASSWORD
- [ ] Set strong JWT_SECRET (64+ characters)
- [ ] SSL certificates installed
- [ ] Firewall configured (ports 80, 443 only)
- [ ] SMTP configured for notifications
- [ ] Microsoft Clarity configured

---

## Firewall Configuration

```bash
# Allow only HTTP and HTTPS
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Troubleshooting

### Frontend not loading

```bash
docker logs securepent_frontend
```

### API errors

```bash
docker logs securepent_api
```

### Database connection issues

```bash
docker logs securepent_db
docker exec -it securepent_db psql -U securepent -d securepent_db
```

### Port 80/443 already in use

```bash
sudo lsof -i :80
sudo systemctl stop nginx  # or apache2
```

---

## Architecture

```
                    ┌────────────────────────────┐
                    │        INTERNET            │
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │    78.109.17.223:80/443    │
                    │     (Nginx Frontend)       │
                    └─────────────┬──────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
    ┌─────────▼─────────┐ ┌───────▼───────┐ ┌────────▼────────┐
    │   Static Files    │ │   /api/*      │ │   PostgreSQL    │
    │   (React SPA)     │ │   Proxy →     │ │   (Internal)    │
    └───────────────────┘ │   api:3001    │ └─────────────────┘
                          └───────────────┘
```

---

## Support

For issues, check logs first:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100
```
