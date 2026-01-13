import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db/pool.js';

const router = Router();

/**
 * Authentication middleware for admin routes
 */
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user exists and is admin
        const result = await query(
            'SELECT id, email, role FROM users WHERE id = $1 AND is_active = true',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Apply auth middleware to all admin routes
router.use(requireAuth);

/**
 * GET /api/admin/dashboard
 * Dashboard overview statistics
 */
router.get('/dashboard', async (req, res) => {
    try {
        // Get lead statistics
        const leadsResult = await query(`
            SELECT 
                COUNT(*) as total_leads,
                COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
                COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
                COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads,
                COUNT(CASE WHEN submitted_at > NOW() - INTERVAL '7 days' THEN 1 END) as leads_this_week,
                COUNT(CASE WHEN submitted_at > NOW() - INTERVAL '30 days' THEN 1 END) as leads_this_month
            FROM leads
        `);

        const stats = leadsResult.rows[0];

        res.json({
            success: true,
            stats: {
                totalLeads: parseInt(stats.total_leads) || 0,
                newLeads: parseInt(stats.new_leads) || 0,
                contactedLeads: parseInt(stats.contacted_leads) || 0,
                convertedLeads: parseInt(stats.converted_leads) || 0,
                leadsThisWeek: parseInt(stats.leads_this_week) || 0,
                leadsThisMonth: parseInt(stats.leads_this_month) || 0,
                // Placeholder values for analytics (would need analytics table)
                totalVisitors: 0,
                pageViews: 0,
                avgSessionDuration: 0
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to load dashboard' });
    }
});

/**
 * GET /api/admin/contacts
 * List all contact form submissions (leads)
 */
router.get('/contacts', async (req, res) => {
    try {
        const { status, limit = 50, offset = 0 } = req.query;

        let queryText = `
            SELECT id, name, email, company, message, service_tier, status, priority, 
                   ip_address, submitted_at, contacted_at, notes
            FROM leads
        `;
        const params = [];

        if (status && status !== 'all') {
            queryText += ' WHERE status = $1';
            params.push(status);
        }

        queryText += ` ORDER BY submitted_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await query(queryText, params);

        // Get total count
        const countResult = await query('SELECT COUNT(*) FROM leads');

        res.json({
            success: true,
            contacts: result.rows,
            total: parseInt(countResult.rows[0].count),
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Contacts fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

/**
 * GET /api/admin/contacts/:id
 * Get single contact details
 */
router.get('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            'SELECT * FROM leads WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({
            success: true,
            contact: result.rows[0]
        });
    } catch (error) {
        console.error('Contact fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch contact' });
    }
});

/**
 * PUT /api/admin/contacts/:id/status
 * Update contact status
 */
router.put('/contacts/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await query(`
            UPDATE leads 
            SET status = $1, 
                contacted_at = CASE WHEN $1 = 'contacted' AND contacted_at IS NULL THEN CURRENT_TIMESTAMP ELSE contacted_at END
            WHERE id = $2
            RETURNING id, status, contacted_at
        `, [status, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({
            success: true,
            message: 'Status updated',
            contact: result.rows[0]
        });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

/**
 * GET /api/admin/analytics/chart-data
 * Analytics chart data (placeholder - needs analytics implementation)
 */
router.get('/analytics/chart-data', async (req, res) => {
    try {
        const { metric = 'visitors', days = 30 } = req.query;

        // Generate placeholder data for now
        // In production, this would query an analytics table
        const data = [];
        const now = new Date();

        for (let i = parseInt(days) - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                value: Math.floor(Math.random() * 100) + 10
            });
        }

        res.json({
            success: true,
            metric,
            days: parseInt(days),
            data
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

/**
 * GET /api/admin/audit-log
 * Get audit log entries
 */
router.get('/audit-log', async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;

        const result = await query(`
            SELECT al.*, u.email as user_email
            FROM audit_log al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT $1 OFFSET $2
        `, [parseInt(limit), parseInt(offset)]);

        res.json({
            success: true,
            logs: result.rows
        });
    } catch (error) {
        console.error('Audit log error:', error);
        res.status(500).json({ error: 'Failed to fetch audit log' });
    }
});

export default router;
