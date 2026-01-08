# Getting Started with SecurePent

This document provides a simple, step-by-step guide to running the SecurePent application (Frontend + Backend + Database).

---

## 🚀 Quick Start (One Command)

If you have **Docker** installed, you can start everything with a single command:

```bash
docker-compose up -d --build
```

This will automatically:
1. Start the PostgreSQL database
2. Build and start the backend API
3. Build and serve the frontend web server

> **Status Check:**
> - Website: [http://localhost](http://localhost)
> - API Health: [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## 🛠️ Manual Setup (Local Development)

If you prefer running services individually (e.g., for coding/debugging), follow this order:

### 1. Database Requirement
You need a PostgreSQL database running.
- **Host**: `localhost`
- **Port**: `5432`
- **Database Name**: `securepent_db`
- **Username**: `securepent` (or your postgres user)
- **Password**: `your_secure_password`

### 2. Configure Backend
First, set up the backend environment variables.

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Create a `.env` file (copy from example):
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` if your database credentials differ from the defaults.*

3. Install backend dependencies:
   ```bash
   npm install
   ```

4. Initialize the Database (Run this once):
   ```bash
   npm run db:init
   ```
   *This creates all tables (users, leads, etc).*

5. Seed Demo Data (Optional):
   ```bash
   npm run db:seed
   ```
   *This creates the admin and demo users.*

6. Start the API Server:
   ```bash
   npm run dev
   ```
   *Server runs on port 3001.*

### 3. Start Frontend
In a **new terminal window**:

1. Navigate to the project root:
   ```bash
   cd ..  # If you were in server/
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Website will be available at http://localhost:5173*

---

## 🔑 Login Credentials

The `db:seed` script creates two default users. You can use these to test the **Client Portal login**.

### 1. System Administrator
- **Email**: `admin@securepent.com`
- **Password**: `SecureAdmin2026!`
- **Role**: Admin

### 2. Demo User
- **Email**: `demo@securepent.com`
- **Password**: `demo123`
- **Role**: Client

---

## 📝 Common Commands

| Action | Command | Where to run |
|--------|---------|--------------|
| **Start Dev Server (Full)** | `./start-dev.sh` | Project Root |
| **Start API Only** | `npm run dev` | `/server` |
| **Start Frontend Only** | `npm run dev` | Project Root |
| **Reset Database** | `npm run db:init` | `/server` |
| **Add Sample Data** | `npm run db:seed` | `/server` |
| **View Website** | Open `http://localhost:5173` | Browser |
| **Check API Status** | `curl http://localhost:3001/api/health` | Terminal |

---

## ⚠️ Troubleshooting

**Database Connection Error?**
- Ensure PostgreSQL is running.
- Check `server/.env` to make sure `DATABASE_URL` matches your local Postgres credentials.

**Login Failed?**
- Run `cd server && npm run db:seed` to reset the default users.

**CORS Error (Network Error)?**
- Ensure the backend is running (`npm run dev` in `/server`).
- Check that the frontend API URL points to the correct port (default 3001).

---

## 📦 Production Build

To test the production build locally:

1. **Build Frontend**:
   ```bash
   npm run build
   npm run preview
   ```

2. **Run Backend in Prod Mode**:
   ```bash
   cd server
   export NODE_ENV=production
   npm start
   ```

---

## 🗺️ Available Pages & Routes

The functionality spans across several simulated and real interactive areas:

| Path | Section Name | Description |
|------|--------------|-------------|
| `/` | **Landing Page** | The main single-page application. |
| `#CompanySection` | **About Us** | Company mission, stats, and values. |
| `#ProductSection` | **Services** | Pricing tiers (External Analysis, Internal Audit). |
| `#MindsSection` | **Our Team** | Team profiles with interactive hover effects. |
| `#InvestorsSection` | **Trust** | "Why Choose Us" section. |
| `#ContactSection` | **Contact** | Lead generation form (POSTs to `/api/leads`). |
| `App.jsx` | **Cookie Modal** | GDPR-compliant cookie settings (preferences synced to backend). |
| `Navigation.jsx` | **Client Portal** | Opens Login Modal (authenticates via `/api/auth/login`). |

### Backend API Routes
These routes are available at `http://localhost:3001` (or your configured port):

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/health` | System health check (Database status, Uptime). |
| **POST** | `/api/auth/login` | Authenticate users and issue JWTs. |
| **POST** | `/api/auth/register` | Register new users (currently backend-only). |
| **POST** | `/api/auth/logout` | Invalidate user session. |
| **POST** | `/api/leads` | Submit a new contact form inquiry. |
| **GET** | `/api/leads` | (Admin) View list of submitted leads. |
| **POST** | `/api/cookies/preferences` | Store user cookie consent choices. |
