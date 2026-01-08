import { Router } from 'express';
import { query } from '../db/pool.js';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint for monitoring
 */
router.get('/', async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    };

    try {
        // Test database connection
        const dbResult = await query('SELECT NOW() as time');
        health.database = {
            status: 'connected',
            time: dbResult.rows[0].time
        };
    } catch (error) {
        health.database = {
            status: 'disconnected',
            error: error.message
        };
        health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
});

/**
 * GET /api/health/ready
 * Readiness probe for Kubernetes/Docker
 */
router.get('/ready', async (req, res) => {
    try {
        await query('SELECT 1');
        res.json({ ready: true });
    } catch (error) {
        res.status(503).json({ ready: false, error: error.message });
    }
});

/**
 * GET /api/health/live
 * Liveness probe
 */
router.get('/live', (req, res) => {
    res.json({ alive: true });
});

export default router;
