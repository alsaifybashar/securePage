# SecurePent Website - Complete Architecture Analysis

A comprehensive analysis of the website structure, user flow, database design considerations, communication patterns, and integration architecture.

---

## 1. Website Overview

**SecurePent** is a single-page React 19 landing page for an offensive security company specializing in **WordPress pentesting services**. The site uses **Vite** as its build tool and features a premium dark theme with glassmorphic design elements.

### Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | React 19.2 |
| Build Tool | Vite 7.3 |
| Styling | Pure CSS3 (Variables, Flexbox, Grid) |
| Security | DOMPurify for XSS protection |
| State | React useState/useEffect (local) |

---

## 2. Website Structure

```mermaid
graph TD
    A[App.jsx] --> B[Layout]
    B --> C[Navigation - Fixed Header]
    B --> D[Hero Section]
    B --> E[Company Section]
    B --> F[Product Section - Services]
    B --> G[Minds Section - Team]
    B --> H[Investors Section - Why Choose Us]
    B --> I[Contact Section - Form]
    
    A --> J[CookieButton]
    A --> K[CookieModal]
    A --> L[ThemeToggle]
    
    C --> M[LoginModal]
    
    style A fill:#38bdf8,color:#000
    style C fill:#06b6d4,color:#000
    style M fill:#06b6d4,color:#000
```

### Component Hierarchy

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| App.jsx | Root component | State management for cookie modal |
| Navigation.jsx | Fixed header | Smooth scroll, Client Portal login |
| Hero.jsx | Landing area | Animated mesh, CTAs |
| CompanySection.jsx | About us | Stats (24/7, 100+ zero-days) |
| ProductSection.jsx | Services | Tier 1 & Tier 2 pricing cards |
| MindsSection.jsx | Team | Grayscale-to-color hover effect |
| InvestorsSection.jsx | Why Choose Us | Trust signals (ethics, OWASP, PoC) |
| ContactSection.jsx | Lead capture | Secure form with validation |
| LoginModal.jsx | Client portal | Brute force protection |
| CookieModal.jsx | GDPR compliance | Toggle preferences |

---

## 3. User Flow

```mermaid
flowchart LR
    subgraph "Landing Experience"
        A[Load Page] --> B[Hero Section]
        B --> C{User Action}
    end
    
    subgraph "Navigation Paths"
        C -->|Request Details| D[Scroll to Contact]
        C -->|Meet The Team| E[Scroll to Minds]
        C -->|Nav Links| F[Smooth Scroll to Section]
    end
    
    subgraph "Conversion Funnel"
        F --> G[View Services]
        G --> H[Request This Service]
        H --> D
        D --> I[Fill Contact Form]
        I --> J[Submit Lead]
    end
    
    subgraph "Client Portal"
        K[Click Client Portal] --> L[Login Modal]
        L --> M{Valid Credentials?}
        M -->|Yes| N[Dashboard Redirect]
        M -->|No - 3x| O[30s Lockout]
    end
```

### Primary User Journeys

1. **New Visitor → Lead Conversion**
   - Land on Hero → Read Company story → View Service tiers → Contact form submission

2. **Existing Client → Portal Access**
   - Nav → Client Portal → Login Modal → Dashboard (future)

3. **Cookie Consent Flow**
   - After 1.5s delay → Cookie button appears → User manages preferences

---

## 4. Current Database Needs (Frontend Only)

> [!IMPORTANT]
> **No backend or database exists currently.** The site is purely frontend.

### Proposed Database Schema

When a backend is implemented, the following entities would be needed:

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string role "admin|client"
        datetime created_at
        datetime last_login
    }
    
    LEADS {
        uuid id PK
        string name
        string email
        text message
        string status "new|contacted|converted|closed"
        datetime submitted_at
        json metadata
    }
    
    COOKIE_PREFERENCES {
        uuid id PK
        string visitor_id UK
        boolean analytics
        boolean marketing
        boolean preferences
        datetime updated_at
    }
    
    AUDIT_LOG {
        uuid id PK
        uuid user_id FK
        string action
        string ip_address
        json details
        datetime timestamp
    }
    
    USERS ||--o{ AUDIT_LOG : "performs"
```

### Data Currently Stored (Client-Side)

| Data | Storage | Key |
|------|---------|-----|
| Cookie preferences | `localStorage` | `cookiePreferences` |
| Cookie consent flag | `localStorage` | `cookieConsent` |
| Login attempts | React state | In-memory only |

---

## 5. Communication Patterns

### Current State (No Backend)

```mermaid
sequenceDiagram
    participant Browser
    participant React App
    participant localStorage
    
    Browser->>React App: Load page
    React App->>localStorage: Check cookie consent
    localStorage-->>React App: Return preferences
    
    Note over React App: User submits contact form
    React App->>React App: Validate & Sanitize inputs
    React App->>Browser: console.log(cleanData)
    Note right of Browser: ⚠️ No actual API call
```

### Proposed Backend Integration

```mermaid
sequenceDiagram
    participant Browser
    participant React App
    participant API Server
    participant Database
    participant Email Service
    
    Note over Browser,Email Service: Contact Form Submission
    Browser->>React App: Submit form
    React App->>React App: Client-side validation
    React App->>API Server: POST /api/leads (sanitized data)
    API Server->>API Server: Server-side validation
    API Server->>Database: INSERT lead
    Database-->>API Server: Success
    API Server->>Email Service: Notify team
    API Server-->>React App: 201 Created
    React App-->>Browser: "Transmission Received"
    
    Note over Browser,Email Service: Login Flow
    Browser->>React App: Submit credentials
    React App->>API Server: POST /api/auth/login
    API Server->>Database: Verify credentials (Argon2)
    API Server->>API Server: Check rate limits (Redis)
    API Server-->>React App: Set HttpOnly cookie
    React App-->>Browser: Redirect to dashboard
```

---

## 6. Security Architecture

### Implemented (Frontend)

| Protection | Location | Details |
|------------|----------|---------|
| **XSS Prevention** | src/utils/security.js | DOMPurify sanitization |
| **SQL Injection Detection** | src/utils/security.js | Regex pattern matching |
| **Command Injection Detection** | src/utils/security.js | Blocks `|`, `&`, `;`, etc. |
| **Brute Force Protection** | src/components/LoginModal.jsx | 3 attempts → 30s lockout |
| **Content Security Policy** | index.html | `default-src 'self'` |

### Required for Backend (See SECURITY.md)

- Argon2/Bcrypt password hashing
- HttpOnly, Secure, SameSite cookies
- CSRF tokens for state-changing requests
- HTTPS with TLS 1.3
- Redis-based rate limiting
- WAF (Cloudflare/AWS)

---

## 7. Integration Architecture

### Full-Stack Integration Plan

```mermaid
flowchart TB
    subgraph "Frontend - React/Vite"
        A[React App]
        B[API Client Service]
        C[Auth Context]
    end
    
    subgraph "API Gateway"
        D[NGINX / Cloudflare]
        E[Rate Limiter]
        F[WAF]
    end
    
    subgraph "Backend - Node.js/Express or Flask"
        G[Auth Controller]
        H[Leads Controller]
        I[Security Middleware]
        J[Session Manager - Redis]
    end
    
    subgraph "Data Layer"
        K[(PostgreSQL)]
        L[(Redis - Sessions/Cache)]
    end
    
    subgraph "External Services"
        M[Email Provider - SendGrid]
        N[Analytics - Plausible]
    end
    
    A --> B
    B --> D
    D --> E --> F --> I
    I --> G & H
    G --> J --> L
    G & H --> K
    H --> M
    A --> N
```

### API Endpoints Needed

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/leads` | POST | Submit contact form |
| `/api/auth/login` | POST | Client portal login |
| `/api/auth/logout` | POST | Destroy session |
| `/api/auth/session` | GET | Verify session |
| `/api/cookies/preferences` | POST | Store server-side consent |

---

## 8. Key Files Summary

| File | Lines | Purpose |
|------|-------|---------|
| src/App.jsx | 51 | Root with section layout |
| src/components/Navigation.jsx | 175 | Fixed nav with scroll |
| src/components/ContactSection.jsx | 286 | Lead capture form |
| src/components/LoginModal.jsx | 289 | Auth simulation |
| src/components/ProductSection.jsx | 258 | Service tier cards |
| src/utils/security.js | 66 | Sanitization utilities |

---

## 9. Current Limitations

> [!WARNING]
> The website is **frontend-only**. Several features are simulated.

| Feature | Current State | Needed |
|---------|---------------|--------|
| Contact form | Logs to console | POST to API |
| Login | Hardcoded demo user | Real auth system |
| Cookie consent | localStorage only | Server-side tracking |
| Rate limiting | In-memory state | Redis-backed |

---

## Conclusion

SecurePent is a well-structured, security-conscious frontend landing page ready for backend integration. The component architecture is modular, the styling is consistent through CSS variables, and client-side security measures (DOMPurify, pattern validation, brute force simulation) demonstrate **security by design principles**.

**Next steps for full integration:**
1. Create Node.js/Express or Flask API server
2. Set up PostgreSQL + Redis
3. Implement JWT or session-based auth
4. Connect Contact form to `/api/leads`
5. Add email notifications for new leads
6. Replace `localStorage` cookie consent with server-side tracking
