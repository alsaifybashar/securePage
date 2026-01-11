# 🔒 SecurePent - Advanced Cybersecurity Website

<div align="center">

![SecurePent](https://img.shields.io/badge/SecurePent-Cybersecurity-00d4aa?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**A premium, secure, and fully-functional cybersecurity company website with integrated analytics, contact management, and hidden admin dashboard.**

[Quick Start](#-quick-start) • [Features](#-features) • [Architecture](#-architecture) • [Security](#-security-features) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Architecture](#-architecture)
- [Pages & Components](#-pages--components)
- [Security Features](#-security-features)
- [How It Works](#-how-it-works)
- [API Reference](#-api-reference)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Option 1: Docker (Recommended - One Command)

```bash
# Clone and start everything
cd /home/wsl-bashar/securePage
docker-compose up --build
```

Access:
- **Website**: http://localhost
- **Admin**: http://localhost/sp-admin-portal-x7k9m2

### Option 2: Development Mode (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd /home/wsl-bashar/securePage/backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /home/wsl-bashar/securePage
npm install
npm run dev
```

Access:
- **Website**: http://localhost:5173
- **Admin**: http://localhost:5173/sp-admin-portal-x7k9m2
- **API Health**: http://localhost:3001/api/health

### Admin Credentials

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `admin123` |

> ⚠️ **IMPORTANT**: Change these credentials immediately in production!

---

## ✨ Features

### Public Website
- 🎨 **Premium Dark Theme** - Modern, high-tech aesthetic
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- 🍪 **GDPR Cookie Consent** - Three-tab consent banner with preferences
- 📧 **Secure Contact Form** - Multi-layer validation and sanitization
- 🔗 **Smooth Navigation** - Single-page scroll with animated sections
- ⚡ **Performance Optimized** - Lazy loading, optimized assets

### Admin Dashboard (Hidden)
- 📊 **Analytics Dashboard** - Visitor counts, page views, session duration
- 👥 **Contact Management** - View, manage, and respond to inquiries
- 📈 **Traffic Insights** - Device types, browsers, top pages
- 🔐 **Secure Authentication** - JWT with account lockout protection
- 📝 **Audit Logging** - All admin actions tracked

### Security
- 🛡️ **Input Sanitization** - XSS and SQL injection prevention
- 🔒 **Rate Limiting** - DDoS and brute force protection
- 🔑 **JWT Authentication** - Secure token-based auth
- 📋 **Security Headers** - Helmet.js CSP, HSTS, etc.
- 🗄️ **Prepared Statements** - SQL injection proof database queries

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NGINX (Docker: Port 80)                             │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │     STATIC FILES (React SPA)    │  │      REVERSE PROXY (/api/*)     │  │
│  │  • index.html                   │  │  → Routes to Backend:3001       │  │
│  │  • CSS/JS bundles               │  │  → Adds security headers        │  │
│  │  • Assets                       │  │  → Handles CORS                 │  │
│  └─────────────────────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP (Internal Network)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js + Express : Port 3001)                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │ SECURITY LAYER   │  │   API ROUTES     │  │    MIDDLEWARE            │  │
│  │ • Helmet.js      │  │ • /api/contact   │  │ • Rate Limiting          │  │
│  │ • CORS           │  │ • /api/analytics │  │ • Request Logging        │  │
│  │ • Rate Limiter   │  │ • /api/auth      │  │ • Error Handler          │  │
│  │ • Input Sanitize │  │ • /api/admin     │  │ • JWT Verification       │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ SQL (Prepared Statements)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (SQLite)                                    │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────────┐   │
│  │    contacts     │ │ analytics_      │ │      admin_users            │   │
│  │ • id            │ │ sessions        │ │ • id                        │   │
│  │ • first_name    │ │ • session_id    │ │ • username                  │   │
│  │ • last_name     │ │ • visitor_id    │ │ • password_hash (bcrypt)    │   │
│  │ • email         │ │ • ip_address    │ │ • failed_attempts           │   │
│  │ • company       │ │ • device_type   │ │ • locked_until              │   │
│  │ • message       │ │ • browser       │ └─────────────────────────────┘   │
│  │ • ip_address    │ │ • page_views    │ ┌─────────────────────────────┐   │
│  │ • status        │ └─────────────────┘ │    admin_audit_log          │   │
│  └─────────────────┘ ┌─────────────────┐ │ • admin_id                  │   │
│                      │ analytics_      │ │ • action                    │   │
│                      │ events          │ │ • ip_address                │   │
│                      │ • event_type    │ │ • timestamp                 │   │
│                      │ • page_url      │ └─────────────────────────────┘   │
│                      │ • click_data    │                                    │
│                      └─────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐     ┌───────────┐
│   VISITOR    │────▶│  COOKIE       │────▶│  ANALYTICS   │────▶│  DATABASE │
│   ARRIVES    │     │  CONSENT      │     │  TRACKER     │     │  STORAGE  │
└──────────────┘     └───────────────┘     └──────────────┘     └───────────┘
                            │                                          │
                            │ If Accepted                              │
                            ▼                                          ▼
                     ┌───────────────┐     ┌──────────────┐     ┌───────────┐
                     │    BROWSE     │────▶│   CONTACT    │────▶│   ADMIN   │
                     │    WEBSITE    │     │   FORM       │     │  REVIEWS  │
                     └───────────────┘     └──────────────┘     └───────────┘
                            │                     │                    │
                            │ Tracks              │ Sanitizes          │ Via
                            ▼                     ▼                    ▼
                     ┌───────────────┐     ┌──────────────┐     ┌───────────┐
                     │ • Page Views  │     │ • XSS Check  │     │ DASHBOARD │
                     │ • Clicks      │     │ • SQL Check  │     │ • Stats   │
                     │ • Scroll      │     │ • Validate   │     │ • Contacts│
                     │ • Time        │     │ • Store      │     │ • Charts  │
                     └───────────────┘     └──────────────┘     └───────────┘
```

---

## 📄 Pages & Components

### Public Pages

| Section | Description | Features |
|---------|-------------|----------|
| **Hero** | Landing section | Animated background, CTAs, tagline |
| **About** | Company information | Stats, mission statement, values |
| **Services** | Two service tiers | Feature lists, pricing cards |
| **Process** | How it works | 5-step process with icons |
| **Team** | Team members | Profile cards with roles |
| **Trust** | Trust signals | Methodology, certifications |
| **Contact** | Contact form | Full validation, sanitization |

### Admin Pages (Hidden)

| Page | URL | Description |
|------|-----|-------------|
| **Login** | `/sp-admin-portal-x7k9m2` | Secure admin authentication |
| **Dashboard** | (After login) | Analytics overview |
| **Contacts** | (Tab in dashboard) | Manage contact submissions |
| **Analytics** | (Tab in dashboard) | Detailed visitor insights |

### Special Components

| Component | Purpose |
|-----------|---------|
| **CookieConsent** | GDPR-compliant cookie banner with 3 tabs |
| **CookieModal** | Settings modal for changing preferences |
| **PrivacyPolicy** | Legal privacy policy modal |
| **ThemeToggle** | Dark/light mode switcher |
| **Navigation** | Responsive nav with mobile hamburger menu |

---

## 🛡️ Security Features

### 1. Input Sanitization (Client-Side)

```javascript
// Using DOMPurify - removes all malicious HTML/JS
sanitizeInput(userInput) → Clean string

// Pattern validation - detects SQL injection attempts
validateInput(input, 'no-sql') → Boolean

// Command injection detection
validateInput(input, 'no-command') → Boolean
```

**Protected Against:**
- ✅ XSS (Cross-Site Scripting)
- ✅ HTML Injection
- ✅ JavaScript Injection
- ✅ Event Handler Injection

### 2. Input Sanitization (Server-Side)

```javascript
// Multi-layer sanitization
sanitizeString(input)   → Removes HTML, trims, limits length
sanitizeName(input)     → Only letters, spaces, hyphens
sanitizeEmail(input)    → Validates and normalizes email
sanitizeMessage(input)  → Allows newlines, strict length limit
```

**Protected Against:**
- ✅ SQL Injection (pattern detection + prepared statements)
- ✅ XSS (server-side HTML stripping)
- ✅ Buffer Overflow (length limits)
- ✅ Null Byte Injection

### 3. Authentication Security

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcrypt with 12 rounds |
| **JWT Tokens** | Signed with secret, 24h expiry |
| **Account Lockout** | 5 failed attempts → 15min lock |
| **Timing Attack Prevention** | Constant-time comparison |
| **Audit Logging** | All auth actions logged |

### 4. Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 15 minutes |
| Login | 5 attempts | 15 minutes |

### 5. Security Headers (Helmet.js)

```
Content-Security-Policy: default-src 'self'; script-src 'self' ...
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 6. Database Security

- **Prepared Statements** - All queries use parameterized inputs
- **No Dynamic SQL** - Query strings never contain user input
- **Index Protection** - Optimized queries prevent DoS
- **WAL Mode** - Write-ahead logging for integrity

### 7. CORS Configuration

```javascript
// Only allowed origins can access the API
allowedOrigins: ['http://localhost:5173', 'http://localhost:3000']
credentials: true
methods: ['GET', 'POST', 'PUT', 'DELETE']
```

---

## ⚙️ How It Works

### Contact Form Submission Flow

```
User fills form → Client validation → Client sanitization → 
API POST /contact → Server validation → Server sanitization →
Prepared statement → SQLite INSERT → Success response →
Form cleared → User sees confirmation
```

### Analytics Tracking Flow

```
User accepts cookies → Session created (UUID) →
Page view tracked → Clicks on buttons tracked →
Scroll depth recorded → Heartbeat updates duration →
Exit event on page leave → All data in dashboard
```

### Admin Authentication Flow

```
Admin visits hidden URL → Enters credentials →
Rate limit check → Username lookup → Password bcrypt compare →
Failed? → Increment attempts → Check lockout →
Success? → Generate JWT → Store in localStorage →
All admin requests include Bearer token →
Token verified on each protected route
```

---

## 📡 API Reference

### Public Endpoints

#### Contact Form
```http
POST /api/contact
Content-Type: application/json

{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@company.com",
    "company": "ACME Corp",
    "jobTitle": "CISO",
    "message": "We need a security audit..."
}

Response (201):
{
    "success": true,
    "message": "Your message has been received.",
    "id": "uuid-here"
}
```

#### Analytics
```http
POST /api/analytics/session
{ "landingPage": "/" }

POST /api/analytics/track
{ "sessionId": "...", "eventType": "page_view", "pageUrl": "/" }

POST /api/analytics/heartbeat
{ "sessionId": "...", "timeOnPage": 120 }
```

#### Health Check
```http
GET /api/health

Response:
{ "status": "healthy", "uptime": 123.45 }
```

### Protected Endpoints (Require JWT)

```http
Authorization: Bearer <jwt-token>

POST /api/auth/login
GET  /api/admin/dashboard
GET  /api/admin/contacts
GET  /api/admin/contacts/:id
PUT  /api/admin/contacts/:id/status
GET  /api/admin/analytics/sessions
GET  /api/admin/analytics/events
GET  /api/admin/analytics/clicks
GET  /api/admin/analytics/chart-data
```

---

## 🔧 Configuration

### Environment Variables (Backend)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Backend server port |
| `NODE_ENV` | development | Environment mode |
| `JWT_SECRET` | (generated) | Secret for signing tokens |
| `JWT_EXPIRES_IN` | 24h | Token expiration time |
| `RATE_LIMIT_MAX` | 100 | Max requests per window |

### Frontend Configuration

The API URL is configured in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

For production, update this or use environment variables.

---

## 📁 Project Structure

```
securePage/
├── 📄 README.md                 # This file
├── 📄 SETUP_GUIDE.md           # Detailed setup instructions
├── 📄 docker-compose.yml       # Docker orchestration
├── 📄 Dockerfile               # Frontend container
├── 📄 nginx.conf               # Nginx configuration
├── 📄 package.json             # Frontend dependencies
├── 📄 vite.config.js           # Vite configuration
├── 📄 index.html               # Entry HTML with CSP
│
├── 📂 src/                     # Frontend source
│   ├── 📄 App.jsx              # Main app component
│   ├── 📄 main.jsx             # Entry point
│   ├── 📄 index.css            # Global styles
│   │
│   ├── 📂 components/          # React components
│   │   ├── Hero.jsx
│   │   ├── Navigation.jsx
│   │   ├── ContactSection.jsx
│   │   ├── CookieConsent.jsx
│   │   └── ... (12 more)
│   │
│   ├── 📂 pages/
│   │   └── 📂 admin/           # Hidden admin dashboard
│   │       ├── AdminPage.jsx
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       └── AdminStyles.css
│   │
│   ├── 📂 services/
│   │   ├── api.js              # API client
│   │   └── analytics.js        # Analytics tracker
│   │
│   └── 📂 utils/
│       ├── security.js         # Client sanitization
│       └── cookieConsent.js    # Cookie utilities
│
└── 📂 backend/                 # Backend source
    ├── 📄 Dockerfile           # Backend container
    ├── 📄 server.js            # Express server
    ├── 📄 package.json         # Backend dependencies
    │
    ├── 📂 config/
    │   └── database.js         # SQLite setup
    │
    ├── 📂 routes/
    │   ├── admin.js            # Dashboard endpoints
    │   ├── analytics.js        # Tracking endpoints
    │   ├── auth.js             # Authentication
    │   └── contact.js          # Contact form
    │
    ├── 📂 middleware/
    │   ├── errorHandler.js
    │   └── requestLogger.js
    │
    ├── 📂 utils/
    │   └── sanitize.js         # Server sanitization
    │
    ├── 📂 scripts/
    │   └── init-db.js          # Database initialization
    │
    └── 📂 data/
        └── securepent.db       # SQLite database (auto-created)
```

---

## 🔍 Troubleshooting

### Backend won't start

```bash
# Check if port is in use
lsof -i :3001

# Reinstall dependencies (for native modules)
cd backend
rm -rf node_modules package-lock.json
npm install
```

### "Failed to fetch" error

1. Verify backend is running: `curl http://localhost:3001/api/health`
2. Check CSP in browser console
3. Ensure CORS allows your origin

### Login not working

```bash
# Reset database
cd backend
rm -rf data
npm run dev   # Recreates with default admin
```

### Forgot Password (Locked Out)

If you have forgotten your admin password or locked yourself out, running this command will reset the password for user `admin` to `admin123`:

**Docker:**
```bash
docker exec -it securepent-backend node scripts/reset-admin.js
```

**Local Dev:**
```bash
cd backend
node scripts/reset-admin.js
```

### Docker issues

```bash
# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

---

## 📜 License

MIT License - Use freely for your projects.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run security audit: `npm audit`
5. Submit a pull request

---

<div align="center">

**Built with 🔒 security-first mindset**

[Report Bug](https://github.com/your-repo/issues) • [Request Feature](https://github.com/your-repo/issues)

</div>
