/**
 * Admin Dashboard Routes
 * Protected routes for viewing analytics and contact submissions
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

/**
 * Authentication Middleware
 * Verifies JWT token for all admin routes
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.admin = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token has expired. Please login again.'
            });
        }
        return res.status(401).json({
            success: false,
            error: 'Invalid token.'
        });
    }
};

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * GET /api/admin/dashboard
 * Get dashboard summary statistics
 */
router.get('/dashboard', (req, res) => {
    try {
        // Get date ranges
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Total visitors (unique visitor IDs)
        const totalVisitors = db.prepare(`
            SELECT COUNT(DISTINCT visitor_id) as count FROM analytics_sessions
        `).get().count;

        // Visitors today
        const visitorsToday = db.prepare(`
            SELECT COUNT(DISTINCT visitor_id) as count FROM analytics_sessions
            WHERE date(started_at) = date('now')
        `).get().count;

        // Visitors this week
        const visitorsWeek = db.prepare(`
            SELECT COUNT(DISTINCT visitor_id) as count FROM analytics_sessions
            WHERE started_at >= datetime('now', '-7 days')
        `).get().count;

        // Total page views
        const totalPageViews = db.prepare(`
            SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view'
        `).get().count;

        // Page views today
        const pageViewsToday = db.prepare(`
            SELECT COUNT(*) as count FROM analytics_events 
            WHERE event_type = 'page_view' AND date(created_at) = date('now')
        `).get().count;

        // Average session duration
        const avgDuration = db.prepare(`
            SELECT AVG(total_time_seconds) as avg FROM analytics_sessions
            WHERE total_time_seconds > 0
        `).get().avg || 0;

        // Total contacts
        const totalContacts = db.prepare(`
            SELECT COUNT(*) as count FROM contacts
        `).get().count;

        // New/unread contacts
        const newContacts = db.prepare(`
            SELECT COUNT(*) as count FROM contacts WHERE status = 'new'
        `).get().count;

        // Contacts this week
        const contactsWeek = db.prepare(`
            SELECT COUNT(*) as count FROM contacts
            WHERE created_at >= datetime('now', '-7 days')
        `).get().count;

        // Device breakdown
        const deviceBreakdown = db.prepare(`
            SELECT device_type, COUNT(*) as count 
            FROM analytics_sessions 
            GROUP BY device_type
        `).all();

        // Browser breakdown
        const browserBreakdown = db.prepare(`
            SELECT browser, COUNT(*) as count 
            FROM analytics_sessions 
            GROUP BY browser
            ORDER BY count DESC
            LIMIT 5
        `).all();

        // Top pages
        const topPages = db.prepare(`
            SELECT page_url, COUNT(*) as views 
            FROM analytics_events 
            WHERE event_type = 'page_view' AND page_url IS NOT NULL AND page_url != ''
            GROUP BY page_url
            ORDER BY views DESC
            LIMIT 10
        `).all();

        res.json({
            success: true,
            data: {
                overview: {
                    totalVisitors,
                    visitorsToday,
                    visitorsWeek,
                    totalPageViews,
                    pageViewsToday,
                    avgSessionDuration: Math.round(avgDuration),
                    totalContacts,
                    newContacts,
                    contactsWeek
                },
                devices: deviceBreakdown,
                browsers: browserBreakdown,
                topPages
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, error: 'Failed to load dashboard data' });
    }
});

/**
 * GET /api/admin/contacts
 * Get contact form submissions
 */
router.get('/contacts', (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let query = 'SELECT * FROM contacts WHERE 1=1';
        const params = [];

        if (status && status !== 'all') {
            query += ' AND status = ?';
            params.push(status);
        }

        if (search) {
            query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Get total count
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
        const total = db.prepare(countQuery).get(...params).count;

        // Get paginated results
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const contacts = db.prepare(query).all(...params);

        res.json({
            success: true,
            data: {
                contacts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });

    } catch (error) {
        console.error('Contacts fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to load contacts' });
    }
});

/**
 * GET /api/admin/contacts/:id
 * Get single contact details
 */
router.get('/contacts/:id', (req, res) => {
    try {
        const { id } = req.params;

        const contact = db.prepare('SELECT * FROM contacts WHERE id = ? OR uuid = ?').get(id, id);

        if (!contact) {
            return res.status(404).json({ success: false, error: 'Contact not found' });
        }

        // Mark as read if new
        if (contact.status === 'new') {
            db.prepare(`UPDATE contacts SET status = 'read', read_at = CURRENT_TIMESTAMP WHERE id = ?`).run(contact.id);
            contact.status = 'read';
        }

        res.json({ success: true, data: contact });

    } catch (error) {
        console.error('Contact fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to load contact' });
    }
});

/**
 * PUT /api/admin/contacts/:id/status
 * Update contact status
 */
router.put('/contacts/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'read', 'replied', 'archived'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const stmt = db.prepare(`
            UPDATE contacts 
            SET status = ?, 
                archived_at = CASE WHEN ? = 'archived' THEN CURRENT_TIMESTAMP ELSE archived_at END
            WHERE id = ? OR uuid = ?
        `);
        const result = stmt.run(status, status, id, id);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Contact not found' });
        }

        res.json({ success: true, message: 'Status updated' });

    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ success: false, error: 'Failed to update status' });
    }
});

/**
 * GET /api/admin/analytics/sessions
 * Get visitor sessions
 */
router.get('/analytics/sessions', (req, res) => {
    try {
        const { page = 1, limit = 50, days = 7 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const sessions = db.prepare(`
            SELECT * FROM analytics_sessions
            WHERE started_at >= datetime('now', '-${parseInt(days)} days')
            ORDER BY started_at DESC
            LIMIT ? OFFSET ?
        `).all(parseInt(limit), offset);

        const total = db.prepare(`
            SELECT COUNT(*) as count FROM analytics_sessions
            WHERE started_at >= datetime('now', '-${parseInt(days)} days')
        `).get().count;

        res.json({
            success: true,
            data: {
                sessions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });

    } catch (error) {
        console.error('Sessions fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to load sessions' });
    }
});

/**
 * GET /api/admin/analytics/events
 * Get tracked events (clicks, page views, etc.)
 */
router.get('/analytics/events', (req, res) => {
    try {
        const { sessionId, eventType, page = 1, limit = 100 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let query = 'SELECT * FROM analytics_events WHERE 1=1';
        const params = [];

        if (sessionId) {
            query += ' AND session_id = ?';
            params.push(sessionId);
        }

        if (eventType) {
            query += ' AND event_type = ?';
            params.push(eventType);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const events = db.prepare(query).all(...params);

        res.json({
            success: true,
            data: { events }
        });

    } catch (error) {
        console.error('Events fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to load events' });
    }
});

/**
 * GET /api/admin/analytics/clicks
 * Get click heatmap data
 */
router.get('/analytics/clicks', (req, res) => {
    try {
        const { days = 7 } = req.query;

        const clicks = db.prepare(`
            SELECT 
                page_url,
                element_id,
                element_class,
                element_text,
                COUNT(*) as click_count,
                AVG(x_position) as avg_x,
                AVG(y_position) as avg_y
            FROM analytics_events
            WHERE event_type = 'click' 
              AND created_at >= datetime('now', '-${parseInt(days)} days')
              AND x_position IS NOT NULL
            GROUP BY page_url, element_id, element_class
            ORDER BY click_count DESC
            LIMIT 100
        `).all();

        res.json({
            success: true,
            data: { clicks }
        });

    } catch (error) {
        console.error('Clicks fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to load click data' });
    }
});

/**
 * GET /api/admin/analytics/chart-data
 * Get time-series data for charts
 */
router.get('/analytics/chart-data', (req, res) => {
    try {
        const { days = 30, metric = 'visitors' } = req.query;

        let data;

        if (metric === 'visitors') {
            data = db.prepare(`
                SELECT 
                    date(started_at) as date,
                    COUNT(DISTINCT visitor_id) as value
                FROM analytics_sessions
                WHERE started_at >= datetime('now', '-${parseInt(days)} days')
                GROUP BY date(started_at)
                ORDER BY date ASC
            `).all();
        } else if (metric === 'pageviews') {
            data = db.prepare(`
                SELECT 
                    date(created_at) as date,
                    COUNT(*) as value
                FROM analytics_events
                WHERE event_type = 'page_view' 
                  AND created_at >= datetime('now', '-${parseInt(days)} days')
                GROUP BY date(created_at)
                ORDER BY date ASC
            `).all();
        } else if (metric === 'contacts') {
            data = db.prepare(`
                SELECT 
                    date(created_at) as date,
                    COUNT(*) as value
                FROM contacts
                WHERE created_at >= datetime('now', '-${parseInt(days)} days')
                GROUP BY date(created_at)
                ORDER BY date ASC
            `).all();
        }

        res.json({
            success: true,
            data: { chartData: data }
        });

    } catch (error) {
        console.error('Chart data error:', error);
        res.status(500).json({ success: false, error: 'Failed to load chart data' });
    }
});

module.exports = router;
