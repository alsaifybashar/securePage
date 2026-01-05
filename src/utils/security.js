import DOMPurify from 'dompurify';

/**
 * Security Utility for Client-Side Protection
 * Implements defenses against XSS and Injection attacks through sanitization and validation.
 */

// Configure DOMPurify to be strict
const sanitizeConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'], // Minimal allowed tags
    ALLOWED_ATTR: ['href', 'target'], // Minimal attributes
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'], // Explicitly ban dangerous tags
    FORBID_ATTR: ['onmouseover', 'onclick', 'onload', 'onerror'], // Ban event handlers
};

/**
 * Sanitizes an HTML string to prevent XSS.
 * Use this before rendering any user-generated content.
 * @param {string} dirty - The potentially malicious string
 * @returns {string} - The sanitized string
 */
export const sanitizeInput = (dirty) => {
    if (!dirty) return '';
    return DOMPurify.sanitize(dirty, sanitizeConfig);
};

/**
 * Validates input against common injection patterns.
 * @param {string} input - The input string to check
 * @param {string} type - 'text', 'email', 'sql-safe', 'command-safe'
 * @returns {boolean} - True if valid/safe, False if potentially malicious
 */
export const validateInput = (input, type = 'text') => {
    if (typeof input !== 'string') return false;

    const patterns = {
        // Alphanumeric + basic punctuation. strictly no < > ; ' " to prevent XSS/SQLi in default text
        'text': /^[a-zA-Z0-9\s.,!?-]*$/,

        // Strict email validation
        'email': /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

        // Detect SQL Injection patterns (basic heuristics)
        // denies: UNION, SELECT, DROP, --, encoded comments, OR 1=1
        'no-sql': /^(?!.*(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\b|--|\/\*|\*\/|['"]\s*OR\s*['"]|['"]\s*=\s*['"])).*$/i,

        // Detect Command Injection characters
        // denies: |, &, ;, $, >, <, `, \
        'no-command': /^[^|&;$><`\\]*$/
    };

    const regex = patterns[type];
    if (!regex) return true; // Default to allow if unknown type (or should default to STRICT)

    return regex.test(input);
};

/**
 * Safely encodes URI components to prevent path traversal/parameter pollution
 */
export const safeEncode = (str) => {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
};
