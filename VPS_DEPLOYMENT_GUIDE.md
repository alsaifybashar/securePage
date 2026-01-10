# 🚀 SECUREPENT Full-Stack VPS Deployment

Complete guide to deploy the full website infrastructure:
- ✅ Frontend (React + Nginx)
- ✅ Backend API (Node.js + Express)
- ✅ Database (PostgreSQL)
- ✅ SSL/HTTPS (Let's Encrypt)
- ✅ Security headers

---

## 📋 Prerequisites

- Ubuntu 22.04+ VPS (2GB RAM minimum)
- Domain name pointing to VPS IP
- SSH access

---

## Step 1: Connect to VPS

```bash
ssh root@YOUR_VPS_IP
```

---

## Step 2: Update System

```bash
apt update && apt upgrade -y
```

---

## Step 3: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Start Docker
systemctl start docker
systemctl enable docker

# Verify
docker --version
```

---

## Step 4: Install Docker Compose

```bash
# Install Docker Compose
apt install -y docker-compose-plugin

# Verify
docker compose version
```

---

## Step 5: Clone the Repository

```bash
cd /opt
git clone https://github.com/YOUR_USERNAME/securePage.git securepent
cd securepent
```

---

## Step 6: Configure Environment Variables

### Copy the template:

```bash
cp .env.example .env
```

### Generate secure passwords:

```bash
# Generate database password
echo "DB_PASSWORD=$(openssl rand -base64 32)" 

# Generate JWT secret
echo "JWT_SECRET=$(openssl rand -base64 64)"
```

### Edit the .env file:

```bash
nano .env
```

Fill in your values:

```env
# Database
DB_PASSWORD=paste_generated_password_here

# Authentication
JWT_SECRET=paste_generated_jwt_secret_here

# URLs
FRONTEND_URL=https://securepent.com
VITE_API_URL=https://securepent.com/api

# Email (optional - for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
NOTIFICATION_EMAIL=team@securepent.com
```

Save: `Ctrl+X`, then `Y`, then `Enter`

---

## Step 7: Deploy with Docker Compose

```bash
# Build and start all services
docker compose up -d --build

# Check status
docker compose ps
```

You should see 3 containers running:
- `securepent_db` (PostgreSQL)
- `securepent_api` (Backend)
- `securepent_frontend` (Nginx)

---

## Step 8: Configure Firewall

```bash
# Allow SSH
ufw allow ssh

# Allow HTTP and HTTPS
ufw allow 80
ufw allow 443

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## Step 9: Test the Website

Visit in your browser:
```
http://YOUR_VPS_IP
```

You should see the website! 🎉

---

## Step 10: Set Up SSL (HTTPS)

### Install Certbot:

```bash
apt install -y certbot
```

### Stop the frontend temporarily:

```bash
docker compose stop frontend
```

### Get SSL certificate:

```bash
certbot certonly --standalone -d securepent.com -d www.securepent.com
```

### Update nginx.conf for SSL:

```bash
nano nginx.conf
```

Replace with:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name securepent.com www.securepent.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name securepent.com www.securepent.com;

    ssl_certificate /etc/letsencrypt/live/securepent.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/securepent.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /usr/share/nginx/html;
    index index.html;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # API Proxy
    location /api {
        proxy_pass http://api:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Update docker-compose.yml to mount SSL certificates:

```bash
nano docker-compose.yml
```

Update the frontend service:

```yaml
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: securepent_frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - api
    restart: unless-stopped
```

### Rebuild and restart:

```bash
docker compose up -d --build
```

---

## Step 11: Set Up Auto-Renewal for SSL

```bash
# Create renewal script
cat > /opt/securepent/renew-ssl.sh << 'EOF'
#!/bin/bash
cd /opt/securepent
docker compose stop frontend
certbot renew --quiet
docker compose start frontend
EOF

chmod +x /opt/securepent/renew-ssl.sh

# Add to crontab (runs monthly)
(crontab -l 2>/dev/null; echo "0 3 1 * * /opt/securepent/renew-ssl.sh") | crontab -
```

---

## ✅ Deployment Complete!

Your full-stack website is now live at:
- 🌐 `https://securepent.com`

---

## 🔧 Useful Commands

### View logs:
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f frontend
docker compose logs -f postgres
```

### Restart services:
```bash
docker compose restart
```

### Stop everything:
```bash
docker compose down
```

### Update website:
```bash
cd /opt/securepent
git pull
docker compose up -d --build
```

### Check database:
```bash
docker exec -it securepent_db psql -U securepent -d securepent_db
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   INTERNET                       │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼ (Port 80/443)
┌─────────────────────────────────────────────────┐
│            NGINX (Frontend Container)            │
│         - Serves React app                       │
│         - Proxies /api to backend               │
│         - SSL termination                        │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼ (Internal: port 3001)
┌─────────────────────────────────────────────────┐
│            API (Backend Container)               │
│         - Express.js                             │
│         - Handles form submissions              │
│         - JWT authentication                     │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼ (Internal: port 5432)
┌─────────────────────────────────────────────────┐
│          PostgreSQL (Database Container)         │
│         - Stores leads                           │
│         - Stores cookie preferences             │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Security Checklist

- [x] HTTPS enabled
- [x] Security headers configured
- [x] Database password secured
- [x] JWT secret secured
- [x] No credentials in git
- [x] Firewall configured
- [x] Input sanitization (DOMPurify)
- [x] SQL injection protection
- [x] XSS protection

---

**Deployment Guide v2.0**
**Last Updated: January 2026**
