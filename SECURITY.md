# Security Architecture & Guidelines

This document outlines the security measures implemented in the SecurePage application and provides guidelines for future backend development to ensure robustness against the Top 50 Security Threats.

## 1. Client-Side Protections (Implemented)

We have implemented "Security by Design" on the frontend to mitigate attacks at the browser level.

### Content Security Policy (CSP)
- **Status**: Implemented in `index.html`.
- **Protection**: Mitigates **XSS (Cross-Site Scripting)**, **Clickjacking**, and **Data Injection**.
- **Rule**: strict `default-src 'self'`, ensuring no unauthorized scripts or styles can load.

### Input Sanitization & Validation
- **Status**: Implemented in `src/utils/security.js` and applied in **Contact Form**.
- **Protection**: Mitigates **XSS**, **SQL Injection**, **Command Injection**.
- **Usage**:
    ```javascript
    import { sanitizeInput, validateInput } from './utils/security';
    // Validate inputs like email or text to block injection patterns
    if (!validateInput(inputValue, 'no-sql')) { ... }
    // Sanitize data before using/sending
    const clean = sanitizeInput(rawInput);
    ```

### Secure Headers
- **Status**: Implemented meta tags for `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 2. Backend Security Requirements (To Be Implemented)

The following controls MUST be implemented in the API/Backend to fully address the threat model.

### Code & Injection Attacks
- **SQL Injection**: Use **Prepared Statements** (ORM or Parameterized Queries) for ALL database interactions. Never concatenate strings.
- **Command Injection**: Avoid `exec()` or `system()` calls. If necessary, whitelist allowed commands.
- **LFI/RFI**: Disable `allow_url_include` in PHP. Validate file paths against a whitelist. Store files with randomized names.
- **XXE/XPath/LDAP**: Disable external entity loading in XML parsers. Use parameterized queries for LDAP.

### Authentication & Identity
- **Credential Storage**: Hash passwords using **Argon2** or **Bcrypt** (work factor > 10).
### Rate Limiting (Brute Force Protection)
- **Status**: Frontend Simulation Implemented in `LoginModal` (Locks after 3 failed attempts). Backend enforcement required.
- **Protection**: Mitigates **Brute Force** and **Credential Stuffing**.
- **Rule**: strict simulated lockout for 30s. API must replicate this with Redis/Database tracking.

### Session Management
- **Status**: Secure UI implemented (Masked inputs, MFA indicators).
- **Backend Requirement**: Use `HttpOnly`, `Secure`, `SameSite=Strict` cookies for session tokens.

### Access Control & Logic
- **IDOR**: Do not use sequential IDs (e.g., `/user/101`). Use **UUIDs**. Check ownership permission on *every* request.
- **CSRF**: Enforce CSRF tokens (Double Submit Cookie pattern) for all state-changing methods (POST, PUT, DELETE).
- **SSRF**: Validate all user-supplied URLs against a whitelist. Block requests to internal IPs (127.0.0.1, 192.168.x.x, metadata services).

### Infrastructure
- **DDoS**: Use a WAF (Cloudflare/AWS WAF) and implement request throttling.
- **SSL/TLS**: Enforce TLS 1.3. Use HSTS (`Strict-Transport-Security` header).
- **Dependency Management**: Run `npm audit` or `snyk` into CI/CD pipeline to catch **Supply Chain Attacks**.

### AI & Emerging Threats
- **Prompt Injection**: If integrating LLMs, sanitize user prompts. Use "System Instructions" as high-priority context. Treat LLM output as untrusted (sanitize it).
- **Bot Mitigation**: Implement CAPTCHA (e.g., Turnstile) on public forms to stop **Automated Scraping** and **Agentic AI** probes.

## 3. Deployment Checklist
1. Ensure `vite.config.js` does NOT generate sourcemaps in production.
2. Enable `helmet` (Express) or equivalent header security headers on the server.
3. Rotate API Keys and ensure `.env` is gitignored.
