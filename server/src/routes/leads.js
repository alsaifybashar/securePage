import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/pool.js';
import { logAudit } from '../services/auditService.js';
import { sendLeadNotification } from '../services/emailService.js';
import { sanitizeInput } from '../utils/sanitize.js';

const router = Router();

// Validation rules for contact form
const leadValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be 2-255 characters')
        .matches(/^[a-zA-Z\s\-'.]+$/)
        .withMessage('Name contains invalid characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email required'),

    body('message')
        .trim()
        .isLength({ min: 10, max: 5000 })
        .withMessage('Message must be 10-5000 characters'),

    body('company')
        .optional()
        .trim()
        .isLength({ max: 255 }),

    body('serviceTier')
        .optional()
        .isIn(['tier1', 'tier2', ''])
        .withMessage('Invalid service tier'),
];

// SQL Injection detection patterns
const sqlPatterns = /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE)\b|--|\*|;|'|\"|\/\*|\*\/)/i;
const xssPatterns = /<script|javascript:|on\w+\s*=/i;

/**
 * POST /api/leads
 * Submit contact form / lead
 */
router.post('/', leadValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, message, company, serviceTier } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');

        // Additional security checks
        const allInputs = `${name} ${email} ${message} ${company || ''}`;

        if (sqlPatterns.test(allInputs)) {
            await logAudit(null, 'sql_injection_attempt', 'lead', null, ip, userAgent, {
                name, email, pattern: 'sql'
            }, 'critical');

            return res.status(400).json({
                error: 'Security violation',
                message: 'Potentially malicious input detected'
            });
        }

        if (xssPatterns.test(allInputs)) {
            await logAudit(null, 'xss_attempt', 'lead', null, ip, userAgent, {
                name, email, pattern: 'xss'
            }, 'critical');

            return res.status(400).json({
                error: 'Security violation',
                message: 'Potentially malicious input detected'
            });
        }

        // Sanitize inputs
        const sanitizedName = sanitizeInput(name);
        const sanitizedMessage = sanitizeInput(message);
        const sanitizedCompany = company ? sanitizeInput(company) : null;

        // Determine priority based on service tier
        const priority = serviceTier === 'tier2' ? 'high' : 'normal';

        // Insert lead
        const result = await query(`
            INSERT INTO leads (name, email, company, message, service_tier, priority, ip_address, user_agent, metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, name, email, submitted_at
        `, [
            sanitizedName,
            email,
            sanitizedCompany,
            sanitizedMessage,
            serviceTier || null,
            priority,
            ip,
            userAgent,
            JSON.stringify({
                source: 'website_contact_form',
                referrer: req.get('Referer') || null,
                timestamp: new Date().toISOString()
            })
        ]);

        const newLead = result.rows[0];

        // Log success
        await logAudit(null, 'lead_created', 'lead', newLead.id, ip, userAgent, {
            name: sanitizedName,
            email,
            serviceTier
        }, 'info');

        // Send email notification (async, don't wait)
        sendLeadNotification(newLead, { name: sanitizedName, email, message: sanitizedMessage, company: sanitizedCompany })
            .catch(err => console.error('Email notification failed:', err));

        res.status(201).json({
            success: true,
            message: 'Transmission securely received',
            leadId: newLead.id,
            submittedAt: newLead.submitted_at
        });

    } catch (error) {
        console.error('Lead submission error:', error);
        res.status(500).json({
            error: 'Submission failed',
            message: 'Please try again later'
        });
    }
});

/**
 * GET /api/leads
 * List leads (admin only - requires auth middleware)
 */
router.get('/', async (req, res) => {
    try {
        // TODO: Add auth middleware check for admin role
        const { status, limit = 50, offset = 0 } = req.query;

        let queryText = `
            SELECT id, name, email, company, message, service_tier, status, priority, submitted_at
            FROM leads
        `;
        const params = [];

        if (status) {
            queryText += ' WHERE status = $1';
            params.push(status);
        }

        queryText += ' ORDER BY submitted_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(parseInt(limit), parseInt(offset));

        const result = await query(queryText, params);

        res.json({
            leads: result.rows,
            count: result.rowCount
        });

    } catch (error) {
        console.error('Leads fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

/**
 * PATCH /api/leads/:id/status
 * Update lead status (admin only)
 */
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await query(`
            UPDATE leads SET status = $1, contacted_at = CASE WHEN $1 = 'contacted' THEN CURRENT_TIMESTAMP ELSE contacted_at END
            WHERE id = $2
            RETURNING id, status
        `, [status, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        res.json({
            message: 'Status updated',
            lead: result.rows[0]
        });

    } catch (error) {
        console.error('Lead update error:', error);
        res.status(500).json({ error: 'Update failed' });
    }
});

export default router;
