# SecurePent Website - Setup & Usage Guide

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Setup Instructions](#setup-instructions)
4. [Accessing the Website](#accessing-the-website)
5. [Admin Dashboard](#admin-dashboard)
6. [How It Works](#how-it-works)
7. [API Reference](#api-reference)
8. [Security Features](#security-features)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v20.0.0 or higher (tested with v24.5.0)
- npm v9 or higher

### Start Everything

**Terminal 1 - Backend:**
```bash
cd /home/wsl-bashar/securePage/backend
rm -rf node_modules package-lock.json  # Clean install
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /home/wsl-bashar/securePage
npm run dev
```

### Access URLs

| Page | URL | Description |
|------|-----|-------------|
| **Main Website** | http://localhost:5173 | Public-facing website |
| **Admin Dashboard** | http://localhost:5173/sp-admin-portal-x7k9m2 | Hidden admin panel |
| **Backend API** | http://localhost:3001/api | API endpoints |
| **Health Check** | http://localhost:3001/api/health | Backend status |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                    (React + Vite)                               │
│                   Port: 5173                                    │
├─────────────────────────────────────────────────────────────────┤
│  Main Website          │  Hidden Admin Dashboard               │
│  - Hero Section        │  - /sp-admin-portal-x7k9m2            │
│  - About/Company       │  - Login required                      │
│  - Services            │  - View analytics                      │
│  - Process             │  - Manage contacts                     │
│  - Team                │  - View visitor data                   │
│  - Contact Form        │                                        │
└────────────────────────┴────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│                    (Node.js + Express)                          │
│                   Port: 3001                                    │
├─────────────────────────────────────────────────────────────────┤
│  /api/contact      - Contact form submissions                   │
│  /api/analytics    - Visitor tracking                           │
│  /api/auth         - Admin authentication                       │
│  /api/admin        - Protected dashboard data                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                 │
│                    (SQLite - better-sqlite3)                    │
│             File: backend/data/securepent.db                    │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                        │
│  - contacts           (form submissions)                        │
│  - analytics_sessions (visitor sessions)                        │
│  - analytics_events   (clicks, page views, scrolls)            │
│  - admin_users        (admin accounts)                          │
│  - admin_audit_log    (security audit trail)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend
cd /home/wsl-bashar/securePage/backend

# Clean install (important for native modules)
rm -rf node_modules package-lock.json
npm install

# Initialize database (optional - auto-creates on first run)
node scripts/init-db.js

# Start development server
npm run dev
```

**Expected Output:**
```
╔══════════════════════════════════════════════════════════════╗
║   🔒 SecurePent Backend Server                              ║
║   Status: Running                                            ║
║   Port: 3001                                                 ║
╚══════════════════════════════════════════════════════════════╝
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd /home/wsl-bashar/securePage

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🌐 Accessing the Website

### Main Website (http://localhost:5173)

The main website has the following sections:

1. **Hero** - Landing section with call-to-action
2. **About** (Company) - Company information and stats
3. **Services** (Product) - Two service tiers offered
4. **Process** - How the service works
5. **Team** (Minds) - Team members
6. **Trust** (Investors) - Trust signals and methodology
7. **Contact** - Contact form

### Cookie Consent

On first visit, users see a GDPR-compliant cookie consent popup with:
- **Consent tab** - Toggle switches for cookie categories
- **Details tab** - Explanation of each cookie type
- **About tab** - Legal information

---

## 🔐 Admin Dashboard

### Access URL
```
http://localhost:5173/sp-admin-portal-x7k9m2
```

> ⚠️ This URL is intentionally obscure for security. Do not share it publicly.

### Default Credentials

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

> ⚠️ **IMPORTANT:** Change the password immediately in production!

### Login Flow

1. Navigate to the admin URL
2. Enter username and password
3. Click "Login"
4. On success, you'll see the dashboard

### Dashboard Features

#### Overview Tab
- Total visitors count
- Page views (today and total)
- Average session duration
- Contact statistics
- Device breakdown (desktop/mobile/tablet)
- Browser statistics
- Top pages

#### Contacts Tab
- List of all contact form submissions
- Click a contact to view details
- Change status: New → Read → Replied → Archived
- View sender's IP address and user agent

#### Analytics Tab
- Weekly activity summary
- Click heatmap data
- Session tracking information

### Logout

Click the "Logout" button in the top-right corner.

---

## ⚙️ How It Works

### Contact Form Flow

1. User fills out form on website
2. Client-side validation runs (sanitization, pattern detection)
3. Form data sent to `POST /api/contact`
4. Server-side validation and sanitization
5. Data stored in SQLite database
6. Success/error response returned
7. Admin sees new contact in dashboard

### Analytics Tracking Flow

1. User accepts statistics cookies
2. Analytics tracker initializes
3. Session created via `POST /api/analytics/session`
4. Page views tracked via `POST /api/analytics/track`
5. Clicks on buttons/links tracked
6. Scroll depth tracked
7. Session duration updated via heartbeat
8. Data visible in admin dashboard

### Authentication Flow

1. Admin navigates to hidden URL
2. Enters credentials
3. `POST /api/auth/login` validates credentials
4. On success, JWT token returned
5. Token stored in localStorage
6. Token sent with all admin API requests
7. Token expires after 24 hours

---

## 📡 API Reference

### Public Endpoints

#### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "company": "ACME Corp",
  "jobTitle": "CISO",
  "message": "I need a security audit..."
}
```

#### Start Analytics Session
```http
POST /api/analytics/session
Content-Type: application/json

{
  "landingPage": "/"
}
```

#### Track Event
```http
POST /api/analytics/track
Content-Type: application/json

{
  "sessionId": "uuid-here",
  "eventType": "page_view",
  "pageUrl": "/about"
}
```

### Protected Endpoints (Require JWT)

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Get Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```

#### Get Contacts
```http
GET /api/admin/contacts?page=1&limit=20&status=new
Authorization: Bearer <token>
```

---

## 🛡️ Security Features

| Feature | Description |
|---------|-------------|
| **Input Sanitization** | All user inputs are sanitized to prevent XSS |
| **SQL Injection Prevention** | Uses parameterized queries (prepared statements) |
| **Rate Limiting** | 100 requests/15min general, 5 attempts/15min for login |
| **Password Hashing** | bcrypt with 12 rounds |
| **JWT Authentication** | Secure token-based auth with expiration |
| **Account Lockout** | Locks after 5 failed login attempts (15 min) |
| **Helmet Headers** | CSP, X-Content-Type-Options, etc. |
| **CORS** | Configured for allowed origins only |
| **Audit Logging** | All admin actions logged |

---

## 🔧 Troubleshooting

### "Failed to fetch" or CSP Error

**Cause:** Content Security Policy blocking API calls

**Solution:** 
1. Make sure backend is running on port 3001
2. The CSP in index.html should include `http://localhost:3001`
3. Hard refresh the page: `Ctrl + Shift + R`

### "The module was compiled against a different Node.js version"

**Cause:** better-sqlite3 compiled for wrong Node version

**Solution:**
```bash
cd /home/wsl-bashar/securePage/backend
rm -rf node_modules package-lock.json
npm install
```

### Login Not Working

**Cause:** Database not initialized or corrupted

**Solution:**
```bash
cd /home/wsl-bashar/securePage/backend
rm -rf data  # Delete database
npm run dev  # Restart - will recreate database
```

### Backend Won't Start

**Check:**
1. Port 3001 not in use: `lsof -i :3001`
2. Node version: `node --version` (needs v20+)
3. Dependencies installed: `npm install`

### Frontend Won't Start

**Check:**
1. Port 5173 not in use: `lsof -i :5173`
2. Dependencies installed: `npm install`
3. Try different port: `vite --port 3000`

---

## 📁 File Structure

```
securePage/
├── index.html              # Main HTML with CSP headers
├── package.json            # Frontend dependencies
├── vite.config.js          # Vite configuration
├── src/
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   ├── index.css           # Global styles
│   ├── components/         # React components
│   │   ├── Hero.jsx
│   │   ├── Navigation.jsx
│   │   ├── ContactSection.jsx
│   │   ├── CookieConsent.jsx
│   │   └── ...
│   ├── pages/
│   │   └── admin/          # Admin dashboard
│   │       ├── AdminPage.jsx
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       └── AdminStyles.css
│   ├── services/
│   │   ├── api.js          # API client
│   │   └── analytics.js    # Analytics tracker
│   └── utils/
│       ├── security.js     # Client-side sanitization
│       └── cookieConsent.js
│
└── backend/
    ├── server.js           # Express server
    ├── package.json        # Backend dependencies
    ├── config/
    │   └── database.js     # SQLite setup
    ├── routes/
    │   ├── admin.js        # Admin endpoints
    │   ├── analytics.js    # Analytics endpoints
    │   ├── auth.js         # Authentication
    │   └── contact.js      # Contact form
    ├── middleware/
    │   ├── errorHandler.js
    │   └── requestLogger.js
    ├── utils/
    │   └── sanitize.js     # Server-side sanitization
    ├── scripts/
    │   └── init-db.js      # Database initialization
    └── data/
        └── securepent.db   # SQLite database (auto-created)
```

---

## 🎯 Next Steps

1. **Change admin password** - Update immediately
2. **Configure production CSP** - Remove 'unsafe-inline' for production
3. **Set up HTTPS** - Required for production
4. **Configure real domain** - Update CORS and CSP
5. **Run security audit** - `npm audit` in both directories
