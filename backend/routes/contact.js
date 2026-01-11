/**
 * Contact Form Routes
 * Handles secure submission and storage of contact form data
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { validateContactForm, sanitizeIP } = require('../utils/sanitize');

/**
 * POST /api/contact
 * Submit a contact form
 */
router.post('/', (req, res) => {
    try {
        // Validate and sanitize input
        const { isValid, errors, warnings, sanitizedData } = validateContactForm(req.body);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors
            });
        }

        // Get client info
        const ipAddress = sanitizeIP(
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.connection?.remoteAddress ||
            req.ip ||
            ''
        );
        const userAgent = req.headers['user-agent']?.substring(0, 500) || '';
        const referrer = req.headers['referer']?.substring(0, 500) || '';

        // Generate UUID for this contact
        const contactUuid = uuidv4();

        // Insert into database using prepared statement (prevents SQL injection)
        const stmt = db.prepare(`
            INSERT INTO contacts (
                uuid, first_name, last_name, email, company, job_title, 
                message, ip_address, user_agent, referrer
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            contactUuid,
            sanitizedData.firstName,
            sanitizedData.lastName,
            sanitizedData.email,
            sanitizedData.company,
            sanitizedData.jobTitle,
            sanitizedData.message,
            ipAddress,
            userAgent,
            referrer
        );

        // Log any warnings (potential attack attempts)
        if (warnings.length > 0) {
            console.warn(`⚠️ Contact form submission warnings [${contactUuid}]:`, warnings);
        }

        console.log(`✅ Contact form submitted: ${contactUuid}`);

        res.status(201).json({
            success: true,
            message: 'Your message has been received. We will get back to you soon.',
            id: contactUuid
        });

    } catch (error) {
        console.error('Contact form submission error:', error);

        res.status(500).json({
            success: false,
            error: 'An error occurred while processing your request. Please try again later.'
        });
    }
});

/**
 * GET /api/contact/status/:uuid
 * Check status of a submitted contact (for users to verify submission)
 */
router.get('/status/:uuid', (req, res) => {
    try {
        const { uuid } = req.params;

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(uuid)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid submission ID'
            });
        }

        const stmt = db.prepare(`
            SELECT uuid, created_at, status 
            FROM contacts 
            WHERE uuid = ?
        `);

        const contact = stmt.get(uuid);

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: 'Submission not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: contact.uuid,
                submittedAt: contact.created_at,
                status: contact.status
            }
        });

    } catch (error) {
        console.error('Contact status check error:', error);

        res.status(500).json({
            success: false,
            error: 'An error occurred while checking the status.'
        });
    }
});

module.exports = router;
