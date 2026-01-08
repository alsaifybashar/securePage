import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/pool.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Validation for cookie preferences
const preferencesValidation = [
    body('visitorId').optional().isString().isLength({ min: 10, max: 255 }),
    body('analytics').isBoolean(),
    body('marketing').isBoolean(),
    body('preferences').isBoolean(),
];

/**
 * POST /api/cookies/preferences
 * Store or update cookie preferences
 */
router.post('/preferences', preferencesValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { visitorId, analytics, marketing, preferences } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');

        // Generate visitor ID if not provided
        if (!visitorId) {
            visitorId = uuidv4();
        }

        // Upsert preferences
        const result = await query(`
            INSERT INTO cookie_preferences (visitor_id, analytics, marketing, preferences, consent_given, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, true, $5, $6)
            ON CONFLICT (visitor_id) DO UPDATE SET
                analytics = EXCLUDED.analytics,
                marketing = EXCLUDED.marketing,
                preferences = EXCLUDED.preferences,
                consent_given = true,
                ip_address = EXCLUDED.ip_address,
                user_agent = EXCLUDED.user_agent,
                updated_at = CURRENT_TIMESTAMP
            RETURNING id, visitor_id, analytics, marketing, preferences, updated_at
        `, [visitorId, analytics, marketing, preferences, ip, userAgent]);

        res.json({
            success: true,
            visitorId,
            preferences: result.rows[0]
        });

    } catch (error) {
        console.error('Cookie preferences error:', error);
        res.status(500).json({ error: 'Failed to save preferences' });
    }
});

/**
 * GET /api/cookies/preferences/:visitorId
 * Get stored preferences for a visitor
 */
router.get('/preferences/:visitorId', async (req, res) => {
    try {
        const { visitorId } = req.params;

        const result = await query(`
            SELECT visitor_id, necessary, analytics, marketing, preferences, consent_given, updated_at
            FROM cookie_preferences
            WHERE visitor_id = $1
        `, [visitorId]);

        if (result.rows.length === 0) {
            return res.json({
                found: false,
                preferences: {
                    necessary: true,
                    analytics: false,
                    marketing: false,
                    preferences: false
                }
            });
        }

        res.json({
            found: true,
            preferences: result.rows[0]
        });

    } catch (error) {
        console.error('Cookie fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch preferences' });
    }
});

/**
 * DELETE /api/cookies/preferences/:visitorId
 * Delete cookie preferences (right to be forgotten)
 */
router.delete('/preferences/:visitorId', async (req, res) => {
    try {
        const { visitorId } = req.params;

        await query('DELETE FROM cookie_preferences WHERE visitor_id = $1', [visitorId]);

        res.json({
            success: true,
            message: 'Preferences deleted'
        });

    } catch (error) {
        console.error('Cookie delete error:', error);
        res.status(500).json({ error: 'Failed to delete preferences' });
    }
});

export default router;
