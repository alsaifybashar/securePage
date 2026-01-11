/**
 * Analytics Routes
 * Tracks visitor sessions, page views, clicks, and other events
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { sanitizeString, sanitizeURL, sanitizeIP } = require('../utils/sanitize');

/**
 * Parse user agent to extract device, browser, and OS info
 */
const parseUserAgent = (ua) => {
    if (!ua) return { device: 'unknown', browser: 'unknown', os: 'unknown' };

    // Device type
    let device = 'desktop';
    if (/mobile/i.test(ua)) device = 'mobile';
    else if (/tablet|ipad/i.test(ua)) device = 'tablet';

    // Browser
    let browser = 'unknown';
    if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/edg/i.test(ua)) browser = 'Edge';
    else if (/chrome/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua)) browser = 'Safari';
    else if (/opera|opr/i.test(ua)) browser = 'Opera';

    // OS
    let os = 'unknown';
    if (/windows/i.test(ua)) os = 'Windows';
    else if (/macintosh|mac os/i.test(ua)) os = 'MacOS';
    else if (/linux/i.test(ua)) os = 'Linux';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

    return { device, browser, os };
};

/**
 * POST /api/analytics/session
 * Start or update a visitor session
 */
router.post('/session', (req, res) => {
    try {
        let { sessionId, visitorId, landingPage } = req.body;

        const ipAddress = sanitizeIP(
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.ip || ''
        );
        const userAgent = req.headers['user-agent']?.substring(0, 500) || '';
        const referrer = sanitizeURL(req.headers['referer'] || '');
        const { device, browser, os } = parseUserAgent(userAgent);

        // If no session ID, create new session
        if (!sessionId) {
            sessionId = uuidv4();
            visitorId = visitorId || uuidv4();

            const stmt = db.prepare(`
                INSERT INTO analytics_sessions (
                    session_id, visitor_id, ip_address, user_agent, referrer,
                    landing_page, device_type, browser, os
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            stmt.run(
                sessionId,
                visitorId,
                ipAddress,
                userAgent,
                referrer,
                sanitizeString(landingPage || '/', { maxLength: 500 }),
                device,
                browser,
                os
            );

            console.log(`📊 New session started: ${sessionId.substring(0, 8)}...`);
        }

        res.json({
            success: true,
            sessionId,
            visitorId
        });

    } catch (error) {
        console.error('Session creation error:', error);
        res.status(500).json({ success: false, error: 'Failed to create session' });
    }
});

/**
 * POST /api/analytics/track
 * Track an event (page view, click, scroll, etc.)
 */
router.post('/track', (req, res) => {
    try {
        const {
            sessionId,
            eventType,
            eventData,
            pageUrl,
            elementId,
            elementClass,
            elementText,
            xPosition,
            yPosition,
            scrollDepth
        } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                error: 'Session ID is required'
            });
        }

        // Validate event type
        const allowedEventTypes = ['page_view', 'click', 'scroll', 'form_start', 'form_submit', 'time_on_page', 'exit'];
        const sanitizedEventType = sanitizeString(eventType, { maxLength: 50, toLowerCase: true });

        if (!allowedEventTypes.includes(sanitizedEventType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid event type'
            });
        }

        // Insert event
        const stmt = db.prepare(`
            INSERT INTO analytics_events (
                session_id, event_type, event_data, page_url,
                element_id, element_class, element_text,
                x_position, y_position, scroll_depth
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            sessionId,
            sanitizedEventType,
            eventData ? JSON.stringify(eventData).substring(0, 1000) : null,
            sanitizeString(pageUrl || '', { maxLength: 500 }),
            sanitizeString(elementId || '', { maxLength: 100 }),
            sanitizeString(elementClass || '', { maxLength: 200 }),
            sanitizeString(elementText || '', { maxLength: 100 }),
            typeof xPosition === 'number' ? Math.round(xPosition) : null,
            typeof yPosition === 'number' ? Math.round(yPosition) : null,
            typeof scrollDepth === 'number' ? Math.min(100, Math.max(0, Math.round(scrollDepth))) : null
        );

        // Update session page views if it's a page view
        if (sanitizedEventType === 'page_view') {
            const updateStmt = db.prepare(`
                UPDATE analytics_sessions 
                SET page_views = page_views + 1, ended_at = CURRENT_TIMESTAMP
                WHERE session_id = ?
            `);
            updateStmt.run(sessionId);
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Event tracking error:', error);
        res.status(500).json({ success: false, error: 'Failed to track event' });
    }
});

/**
 * POST /api/analytics/heartbeat
 * Update session duration
 */
router.post('/heartbeat', (req, res) => {
    try {
        const { sessionId, timeOnPage } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, error: 'Session ID required' });
        }

        const stmt = db.prepare(`
            UPDATE analytics_sessions 
            SET ended_at = CURRENT_TIMESTAMP,
                total_time_seconds = ?
            WHERE session_id = ?
        `);

        stmt.run(
            typeof timeOnPage === 'number' ? Math.round(timeOnPage) : 0,
            sessionId
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Heartbeat error:', error);
        res.status(500).json({ success: false, error: 'Failed to update session' });
    }
});

module.exports = router;
