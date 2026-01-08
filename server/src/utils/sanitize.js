/**
 * Input Sanitization Utilities
 * Server-side sanitization to complement client-side security
 */

/**
 * Sanitize a string by removing potentially dangerous characters
 * @param {string} input - Raw input string
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return '';
    }

    return input
        // Remove null bytes
        .replace(/\0/g, '')
        // Remove script tags
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers
        .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Remove data: protocol (for XSS via data URIs)
        .replace(/data:/gi, '')
        // Escape HTML entities
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        // Trim whitespace
        .trim();
};

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Check for SQL injection patterns
 * @param {string} input 
 * @returns {boolean} - true if suspicious
 */
export const hasSqlInjection = (input) => {
    const sqlPatterns = /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|EXEC|EXECUTE)\b|--|\*|;(?!$)|'|"|\||\/\*|\*\/)/i;
    return sqlPatterns.test(input);
};

/**
 * Check for XSS patterns
 * @param {string} input 
 * @returns {boolean} - true if suspicious
 */
export const hasXssPatterns = (input) => {
    const xssPatterns = /<script|javascript:|on\w+\s*=|<iframe|<object|<embed|<link|<style/i;
    return xssPatterns.test(input);
};

/**
 * Sanitize an object's string properties recursively
 * @param {object} obj 
 * @returns {object}
 */
export const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeInput(value);
        } else if (typeof value === 'object') {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};
