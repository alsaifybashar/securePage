/**
 * Input Sanitization Utilities
 * Provides comprehensive sanitization to prevent XSS, SQL Injection, and other attacks
 */

const sanitizeHtml = require('sanitize-html');
const validator = require('validator');

/**
 * Sanitize a string input - removes HTML, trims, and normalizes
 * @param {string} input - The input to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} - Sanitized string
 */
const sanitizeString = (input, options = {}) => {
    if (typeof input !== 'string') {
        return '';
    }

    const {
        maxLength = 1000,
        allowNewlines = false,
        toLowerCase = false,
        toUpperCase = false
    } = options;

    // Remove all HTML tags
    let sanitized = sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'discard'
    });

    // Trim whitespace
    sanitized = sanitized.trim();

    // Remove or preserve newlines
    if (!allowNewlines) {
        sanitized = sanitized.replace(/[\r\n]+/g, ' ');
    } else {
        // Normalize newlines
        sanitized = sanitized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    // Remove null bytes and other control characters
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Truncate to max length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    // Case conversion
    if (toLowerCase) {
        sanitized = sanitized.toLowerCase();
    } else if (toUpperCase) {
        sanitized = sanitized.toUpperCase();
    }

    return sanitized;
};

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email or empty string if invalid
 */
const sanitizeEmail = (email) => {
    if (typeof email !== 'string') {
        return '';
    }

    // Normalize and trim
    let sanitized = email.toLowerCase().trim();

    // Remove any HTML
    sanitized = sanitizeHtml(sanitized, {
        allowedTags: [],
        allowedAttributes: {}
    });

    // Validate email format
    if (!validator.isEmail(sanitized)) {
        return '';
    }

    // Normalize email
    return validator.normalizeEmail(sanitized) || '';
};

/**
 * Sanitize a name (first name, last name, company, etc.)
 * @param {string} name - Name to sanitize
 * @returns {string} - Sanitized name
 */
const sanitizeName = (name) => {
    if (typeof name !== 'string') {
        return '';
    }

    let sanitized = sanitizeString(name, { maxLength: 100 });

    // Remove any characters that aren't letters, spaces, hyphens, or apostrophes
    sanitized = sanitized.replace(/[^a-zA-ZÀ-ÿ\s'\-\.]/g, '');

    // Remove multiple spaces
    sanitized = sanitized.replace(/\s+/g, ' ');

    return sanitized;
};

/**
 * Sanitize a message/text area input
 * @param {string} message - Message to sanitize
 * @returns {string} - Sanitized message
 */
const sanitizeMessage = (message) => {
    return sanitizeString(message, {
        maxLength: 5000,
        allowNewlines: true
    });
};

/**
 * Sanitize IP address
 * @param {string} ip - IP address to sanitize
 * @returns {string} - Sanitized IP or empty string
 */
const sanitizeIP = (ip) => {
    if (typeof ip !== 'string') {
        return '';
    }

    const trimmed = ip.trim();

    if (validator.isIP(trimmed)) {
        return trimmed;
    }

    return '';
};

/**
 * Sanitize URL
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL or empty string
 */
const sanitizeURL = (url) => {
    if (typeof url !== 'string') {
        return '';
    }

    let sanitized = url.trim();

    // Remove any HTML
    sanitized = sanitizeHtml(sanitized, {
        allowedTags: [],
        allowedAttributes: {}
    });

    // Validate URL
    if (validator.isURL(sanitized, { require_protocol: true })) {
        return sanitized;
    }

    return '';
};

/**
 * Detect potential SQL injection patterns
 * @param {string} input - Input to check
 * @returns {boolean} - True if suspicious pattern detected
 */
const detectSQLInjection = (input) => {
    if (typeof input !== 'string') {
        return false;
    }

    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|FETCH|DECLARE|TRUNCATE)\b)/i,
        /(--|#|\/\*|\*\/)/,
        /(\bOR\b\s+\d+\s*=\s*\d+)/i,
        /(\bAND\b\s+\d+\s*=\s*\d+)/i,
        /(';|";|`)/,
        /(\bWAITFOR\b|\bBENCHMARK\b|\bSLEEP\b)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Detect potential XSS patterns
 * @param {string} input - Input to check
 * @returns {boolean} - True if suspicious pattern detected
 */
const detectXSS = (input) => {
    if (typeof input !== 'string') {
        return false;
    }

    const xssPatterns = [
        /<script\b[^>]*>/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe\b/i,
        /<object\b/i,
        /<embed\b/i,
        /<link\b[^>]*href/i,
        /expression\s*\(/i,
        /url\s*\(/i
    ];

    return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Validate and sanitize contact form data
 * @param {object} data - Contact form data
 * @returns {object} - { isValid, errors, sanitizedData }
 */
const validateContactForm = (data) => {
    const errors = [];
    const warnings = [];

    // Sanitize all fields
    const sanitizedData = {
        firstName: sanitizeName(data.firstName),
        lastName: sanitizeName(data.lastName),
        email: sanitizeEmail(data.email),
        company: sanitizeName(data.company || ''),
        jobTitle: sanitizeName(data.jobTitle || ''),
        message: sanitizeMessage(data.message)
    };

    // Check for injection attempts
    const allInputs = [data.firstName, data.lastName, data.email, data.company, data.jobTitle, data.message].filter(Boolean);

    for (const input of allInputs) {
        if (detectSQLInjection(input)) {
            warnings.push('Suspicious pattern detected in input');
        }
        if (detectXSS(input)) {
            warnings.push('HTML/script content detected and removed');
        }
    }

    // Validation
    if (!sanitizedData.firstName || sanitizedData.firstName.length < 2) {
        errors.push('First name is required and must be at least 2 characters');
    }

    if (!sanitizedData.lastName || sanitizedData.lastName.length < 2) {
        errors.push('Last name is required and must be at least 2 characters');
    }

    if (!sanitizedData.email) {
        errors.push('A valid email address is required');
    }

    if (!sanitizedData.message || sanitizedData.message.length < 10) {
        errors.push('Message is required and must be at least 10 characters');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        sanitizedData
    };
};

module.exports = {
    sanitizeString,
    sanitizeEmail,
    sanitizeName,
    sanitizeMessage,
    sanitizeIP,
    sanitizeURL,
    detectSQLInjection,
    detectXSS,
    validateContactForm
};
