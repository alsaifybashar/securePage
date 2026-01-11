# 📡 SecurePent API Documentation

Complete API reference for the SecurePent backend server.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Public Endpoints](#public-endpoints)
  - [Health Check](#health-check)
  - [Contact Form](#contact-form)
  - [Analytics](#analytics)
- [Protected Endpoints](#protected-endpoints)
  - [Authentication](#auth-endpoints)
  - [Dashboard](#dashboard-endpoints)
  - [Contacts Management](#contacts-management)
  - [Analytics Data](#analytics-data)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Overview

**Base URL:** `http://localhost:3001/api`

**Content-Type:** All requests should use `application/json`

**Response Format:**
```json
{
    "success": true|false,
    "data": { ... },      // On success
    "error": "message",   // On failure
    "details": [...]      // Optional validation errors
}
```

---

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

Tokens are obtained via the `/api/auth/login` endpoint and expire after 24 hours.

---

## Public Endpoints

These endpoints are accessible without authentication.

---

### Health Check

Check if the backend server is running and healthy.

#### `GET /api/health`

**Purpose:** Verify server status, useful for monitoring and Docker health checks.

**Request:**
```bash
curl http://localhost:3001/api/health
```

**Response (200 OK):**
```json
{
    "status": "healthy",
    "timestamp": "2026-01-11T02:00:00.000Z",
    "uptime": 3600.123
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "healthy" if server is running |
| `timestamp` | string | Current server time (ISO 8601) |
| `uptime` | number | Seconds since server started |

---

### Contact Form

Submit and track contact form submissions.

#### `POST /api/contact`

**Purpose:** Submit a contact form inquiry. Data is validated, sanitized, and stored securely.

**Request:**
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "company": "ACME Corporation",
    "jobTitle": "Chief Security Officer",
    "message": "We are interested in a security audit for our web applications."
  }'
```

**Request Body:**

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `firstName` | string | ✅ | 100 | First name (letters, spaces, hyphens only) |
| `lastName` | string | ✅ | 100 | Last name (letters, spaces, hyphens only) |
| `email` | string | ✅ | 254 | Valid email address |
| `company` | string | ❌ | 100 | Company name |
| `jobTitle` | string | ❌ | 100 | Job title |
| `message` | string | ✅ | 5000 | Inquiry message (min 10 chars) |

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Your message has been received. We will get back to you soon.",
    "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (400 Bad Request):**
```json
{
    "success": false,
    "error": "Validation failed",
    "details": [
        "First name is required and must be at least 2 characters",
        "A valid email address is required"
    ]
}
```

**Security Features:**
- ✅ HTML tags stripped (XSS prevention)
- ✅ SQL injection patterns detected and blocked
- ✅ Input length limits enforced
- ✅ Email format validated
- ✅ Client IP and user agent logged for audit

---

#### `GET /api/contact/status/:uuid`

**Purpose:** Check the status of a previously submitted contact form.

**Request:**
```bash
curl http://localhost:3001/api/contact/status/550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "submittedAt": "2026-01-11T02:00:00.000Z",
        "status": "new"
    }
}
```

**Status Values:**
| Status | Description |
|--------|-------------|
| `new` | Just submitted, not yet reviewed |
| `read` | Admin has viewed the submission |
| `replied` | Admin has responded |
| `archived` | Closed/archived |

**Response (404 Not Found):**
```json
{
    "success": false,
    "error": "Submission not found"
}
```

---

### Analytics

Track visitor behavior (requires statistics cookie consent).

#### `POST /api/analytics/session`

**Purpose:** Create a new visitor session for analytics tracking.

**Request:**
```bash
curl -X POST http://localhost:3001/api/analytics/session \
  -H "Content-Type: application/json" \
  -d '{
    "landingPage": "/",
    "visitorId": "existing-visitor-id-if-any"
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `landingPage` | string | ❌ | First page URL visited |
| `visitorId` | string | ❌ | Existing visitor ID (for returning visitors) |

**Response (200 OK):**
```json
{
    "success": true,
    "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "visitorId": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

**How to Use:**
1. Store `sessionId` in sessionStorage (for current session)
2. Store `visitorId` in localStorage (for returning visitor tracking)
3. Include `sessionId` in all subsequent tracking calls

---

#### `POST /api/analytics/track`

**Purpose:** Track page views, clicks, and scroll events.

**Request:**
```bash
curl -X POST http://localhost:3001/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "eventType": "page_view",
    "pageUrl": "/services"
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | string | ✅ | Session ID from `/session` |
| `eventType` | string | ✅ | Type of event (see below) |
| `pageUrl` | string | ❌ | Current page URL |
| `elementId` | string | ❌ | Clicked element's ID |
| `elementClass` | string | ❌ | Clicked element's class |
| `elementText` | string | ❌ | Clicked element's text content |
| `xPosition` | number | ❌ | Click X coordinate |
| `yPosition` | number | ❌ | Click Y coordinate |
| `scrollDepth` | number | ❌ | Scroll depth percentage (0-100) |
| `eventData` | object | ❌ | Additional custom data |

**Event Types:**
| Event | Description |
|-------|-------------|
| `page_view` | User viewed a page |
| `click` | User clicked an element |
| `scroll` | User scrolled (with depth) |
| `form_start` | User started filling a form |
| `form_submit` | User submitted a form |
| `time_on_page` | Time spent (via heartbeat) |
| `exit` | User left the page |

**Response (200 OK):**
```json
{
    "success": true
}
```

**Example - Track a Button Click:**
```bash
curl -X POST http://localhost:3001/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "eventType": "click",
    "pageUrl": "/",
    "elementId": "contact-btn",
    "elementText": "Contact Us",
    "xPosition": 500,
    "yPosition": 300
  }'
```

---

#### `POST /api/analytics/heartbeat`

**Purpose:** Update session duration (call every 30 seconds while user is active).

**Request:**
```bash
curl -X POST http://localhost:3001/api/analytics/heartbeat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "timeOnPage": 120
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | string | ✅ | Session ID |
| `timeOnPage` | number | ✅ | Total seconds on site |

**Response (200 OK):**
```json
{
    "success": true
}
```

---

## Protected Endpoints

These endpoints require authentication via JWT token.

---

### Auth Endpoints

#### `POST /api/auth/login`

**Purpose:** Authenticate admin user and receive JWT token.

**Rate Limit:** 5 attempts per 15 minutes

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `username` | string | ✅ |
| `password` | string | ✅ |

**Response (200 OK):**
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "username": "admin",
        "role": "superadmin"
    },
    "expiresIn": "24h"
}
```

**Response (401 Unauthorized):**
```json
{
    "success": false,
    "error": "Invalid credentials"
}
```

**Response (423 Locked):**
```json
{
    "success": false,
    "error": "Account is temporarily locked. Please try again later.",
    "lockedUntil": "2026-01-11T02:15:00.000Z"
}
```

**Security Features:**
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Account lockout after 5 failed attempts
- ✅ Constant-time comparison (timing attack prevention)
- ✅ All login attempts logged in audit trail

---

#### `POST /api/auth/logout`

**Purpose:** Log out (client should discard token).

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

#### `POST /api/auth/change-password`

**Purpose:** Change admin password.

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/change-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "NewSecureP@ss123"
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `currentPassword` | string | ✅ | Current password |
| `newPassword` | string | ✅ | New password (min 8 chars) |

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Password changed successfully"
}
```

---

### Dashboard Endpoints

#### `GET /api/admin/dashboard`

**Purpose:** Get all dashboard statistics in one call.

**Request:**
```bash
curl http://localhost:3001/api/admin/dashboard \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "overview": {
            "totalVisitors": 1250,
            "visitorsToday": 45,
            "visitorsWeek": 312,
            "totalPageViews": 5430,
            "pageViewsToday": 156,
            "avgSessionDuration": 185,
            "totalContacts": 89,
            "newContacts": 12,
            "contactsWeek": 23
        },
        "devices": [
            { "device_type": "desktop", "count": 850 },
            { "device_type": "mobile", "count": 350 },
            { "device_type": "tablet", "count": 50 }
        ],
        "browsers": [
            { "browser": "Chrome", "count": 620 },
            { "browser": "Firefox", "count": 280 },
            { "browser": "Safari", "count": 200 },
            { "browser": "Edge", "count": 100 },
            { "browser": "Opera", "count": 50 }
        ],
        "topPages": [
            { "page_url": "/", "views": 2100 },
            { "page_url": "/services", "views": 1200 },
            { "page_url": "/about", "views": 850 },
            { "page_url": "/contact", "views": 780 }
        ]
    }
}
```

---

### Contacts Management

#### `GET /api/admin/contacts`

**Purpose:** List all contact form submissions with pagination and filtering.

**Request:**
```bash
curl "http://localhost:3001/api/admin/contacts?page=1&limit=20&status=new" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Results per page |
| `status` | string | all | Filter: new, read, replied, archived |
| `search` | string | - | Search in name, email, company |

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "contacts": [
            {
                "id": 1,
                "uuid": "550e8400-e29b-41d4-a716-446655440000",
                "first_name": "John",
                "last_name": "Doe",
                "email": "john@company.com",
                "company": "ACME Corp",
                "job_title": "CISO",
                "message": "We need security audit...",
                "ip_address": "192.168.1.1",
                "user_agent": "Mozilla/5.0...",
                "referrer": "https://google.com",
                "created_at": "2026-01-11T02:00:00.000Z",
                "read_at": null,
                "archived_at": null,
                "status": "new"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 20,
            "total": 89,
            "totalPages": 5
        }
    }
}
```

---

#### `GET /api/admin/contacts/:id`

**Purpose:** Get single contact details. Automatically marks as "read" if status is "new".

**Request:**
```bash
curl http://localhost:3001/api/admin/contacts/1 \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "uuid": "550e8400-e29b-41d4-a716-446655440000",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@company.com",
        "company": "ACME Corp",
        "job_title": "CISO",
        "message": "We need security audit for our web applications...",
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
        "referrer": "https://google.com",
        "created_at": "2026-01-11T02:00:00.000Z",
        "read_at": "2026-01-11T02:30:00.000Z",
        "archived_at": null,
        "status": "read"
    }
}
```

---

#### `PUT /api/admin/contacts/:id/status`

**Purpose:** Update contact status.

**Request:**
```bash
curl -X PUT http://localhost:3001/api/admin/contacts/1/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "replied"}'
```

**Request Body:**

| Field | Type | Values |
|-------|------|--------|
| `status` | string | new, read, replied, archived |

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Status updated"
}
```

---

### Analytics Data

#### `GET /api/admin/analytics/sessions`

**Purpose:** Get raw session data.

**Request:**
```bash
curl "http://localhost:3001/api/admin/analytics/sessions?days=7&limit=50" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 50 | Results per page |
| `days` | number | 7 | Look back period |

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "sessions": [
            {
                "id": 1,
                "session_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "visitor_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
                "ip_address": "192.168.1.1",
                "user_agent": "Mozilla/5.0...",
                "referrer": "https://google.com",
                "landing_page": "/",
                "device_type": "desktop",
                "browser": "Chrome",
                "os": "Windows",
                "started_at": "2026-01-11T01:00:00.000Z",
                "ended_at": "2026-01-11T01:15:00.000Z",
                "page_views": 5,
                "total_time_seconds": 900
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 50,
            "total": 312,
            "totalPages": 7
        }
    }
}
```

---

#### `GET /api/admin/analytics/events`

**Purpose:** Get raw event data (clicks, page views, etc.).

**Request:**
```bash
curl "http://localhost:3001/api/admin/analytics/events?eventType=click&limit=100" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Filter by session |
| `eventType` | string | Filter by event type |
| `page` | number | Page number |
| `limit` | number | Results per page |

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "events": [
            {
                "id": 1,
                "session_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "event_type": "click",
                "event_data": null,
                "page_url": "/",
                "element_id": "contact-btn",
                "element_class": "btn btn-primary",
                "element_text": "Contact Us",
                "x_position": 500,
                "y_position": 300,
                "scroll_depth": null,
                "created_at": "2026-01-11T01:05:00.000Z"
            }
        ]
    }
}
```

---

#### `GET /api/admin/analytics/clicks`

**Purpose:** Get aggregated click data for heatmap visualization.

**Request:**
```bash
curl "http://localhost:3001/api/admin/analytics/clicks?days=7" \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "clicks": [
            {
                "page_url": "/",
                "element_id": "contact-btn",
                "element_class": "btn btn-primary",
                "element_text": "Contact Us",
                "click_count": 156,
                "avg_x": 512.5,
                "avg_y": 305.2
            },
            {
                "page_url": "/",
                "element_id": "services-link",
                "element_class": "nav-link",
                "element_text": "Services",
                "click_count": 89,
                "avg_x": 450.0,
                "avg_y": 50.0
            }
        ]
    }
}
```

---

#### `GET /api/admin/analytics/chart-data`

**Purpose:** Get time-series data for dashboard charts.

**Request:**
```bash
curl "http://localhost:3001/api/admin/analytics/chart-data?metric=visitors&days=30" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**

| Parameter | Type | Options | Default |
|-----------|------|---------|---------|
| `metric` | string | visitors, pageviews, contacts | visitors |
| `days` | number | 1-365 | 30 |

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "chartData": [
            { "date": "2025-12-12", "value": 45 },
            { "date": "2025-12-13", "value": 52 },
            { "date": "2025-12-14", "value": 38 },
            { "date": "2025-12-15", "value": 61 }
        ]
    }
}
```

---

## Error Handling

All errors follow this format:

```json
{
    "success": false,
    "error": "Human-readable error message",
    "details": ["Validation error 1", "Validation error 2"]
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created (new resource) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 423 | Locked (account locked) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Rate Limiting

| Endpoint | Limit | Window | Response |
|----------|-------|--------|----------|
| All `/api/*` | 100 requests | 15 minutes | 429 Too Many Requests |
| `/api/auth/login` | 5 attempts | 15 minutes | 429 Too Many Requests |

**Rate Limit Response:**
```json
{
    "error": "Too many requests from this IP, please try again later.",
    "retryAfter": "15 minutes"
}
```

---

## Testing with cURL

### Complete Flow Example

```bash
# 1. Submit a contact form
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@tech.com",
    "company": "TechCorp",
    "jobTitle": "CTO",
    "message": "We need a security assessment."
  }'

# 2. Login as admin
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.token')

# 3. View dashboard stats
curl http://localhost:3001/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"

# 4. List new contacts
curl "http://localhost:3001/api/admin/contacts?status=new" \
  -H "Authorization: Bearer $TOKEN"

# 5. Mark contact as replied
curl -X PUT http://localhost:3001/api/admin/contacts/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "replied"}'
```

---

## SDK / Client Usage

The frontend uses a centralized API service at `src/services/api.js`:

```javascript
import { 
    submitLead, 
    adminLogin, 
    getDashboardStats,
    getContacts,
    updateContactStatus 
} from './services/api';

// Submit contact form
await submitLead({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@company.com',
    message: 'Hello!'
});

// Admin login
const { token, user } = await adminLogin('admin', 'password');

// Get dashboard data
const stats = await getDashboardStats();

// Get contacts with pagination
const contacts = await getContacts({ page: 1, limit: 20, status: 'new' });

// Update contact status
await updateContactStatus(1, 'replied');
```

---

<div align="center">

**SecurePent API v1.0**

Built with security-first design principles.

</div>
