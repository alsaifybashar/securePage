# SecurePent Backend

Secure backend API for the SecurePent website, handling contact forms, analytics, and admin dashboard.

## Features

- 🔒 **Secure Contact Form** - Input validation, sanitization, SQL injection & XSS protection
- 📊 **Analytics Tracking** - Visitor sessions, page views, clicks, scroll depth
- 👤 **Admin Dashboard** - Protected dashboard for viewing analytics and contacts
- 🔐 **JWT Authentication** - Secure admin authentication with account lockout
- 📝 **Audit Logging** - All admin actions are logged

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example environment file and edit it:

```bash
cp .env.example .env
```

**Important**: Change these values in production:
- `JWT_SECRET` - Generate a strong random string
- `ADMIN_USERNAME` - Change from default
- First login uses password: `admin123` (change immediately!)

### 3. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact/status/:uuid` | Check submission status |
| POST | `/api/analytics/session` | Start analytics session |
| POST | `/api/analytics/track` | Track events |
| POST | `/api/analytics/heartbeat` | Update session duration |
| POST | `/api/auth/login` | Admin login |

### Protected Endpoints (Require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/contacts` | List contacts |
| GET | `/api/admin/contacts/:id` | View contact details |
| PUT | `/api/admin/contacts/:id/status` | Update contact status |
| GET | `/api/admin/analytics/sessions` | Visitor sessions |
| GET | `/api/admin/analytics/events` | Tracked events |
| GET | `/api/admin/analytics/clicks` | Click heatmap data |
| GET | `/api/admin/analytics/chart-data` | Time-series data |

## Security Features

### Input Sanitization
- All inputs are sanitized using `sanitize-html` and `validator`
- SQL injection patterns are detected and blocked
- XSS patterns are detected and removed
- Prepared statements prevent SQL injection

### Rate Limiting
- 100 requests per 15 minutes per IP (general)
- 5 attempts per 15 minutes for login

### Authentication
- JWT tokens with configurable expiration
- Password hashing with bcrypt (12 rounds)
- Account lockout after 5 failed attempts
- All auth actions logged to audit trail

### Headers (via Helmet)
- Content Security Policy
- X-Content-Type-Options
- X-Frame-Options
- Strict-Transport-Security

## Database

SQLite database with the following tables:

- `contacts` - Contact form submissions
- `analytics_sessions` - Visitor sessions
- `analytics_events` - Page views, clicks, etc.
- `admin_users` - Admin accounts
- `admin_audit_log` - Admin action history

Database file: `./data/securepent.db`

## Admin Portal

Access the admin dashboard at:
```
http://localhost:5173/sp-admin-portal-x7k9m2
```

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change these immediately in production!**

## Folder Structure

```
backend/
├── config/
│   └── database.js      # Database connection & schema
├── middleware/
│   ├── errorHandler.js  # Error handling
│   └── requestLogger.js # Request logging
├── routes/
│   ├── admin.js         # Admin dashboard routes
│   ├── analytics.js     # Analytics tracking
│   ├── auth.js          # Authentication
│   └── contact.js       # Contact form
├── utils/
│   └── sanitize.js      # Input sanitization
├── data/                # SQLite database (auto-created)
├── server.js            # Main server file
├── package.json
└── .env.example
```

## Running with Frontend

Start both servers:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

The frontend will connect to the backend at `http://localhost:3001/api`
