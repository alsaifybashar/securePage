import jwt from 'jsonwebtoken';
import { query } from '../db/pool.js';

/**
 * JWT Authentication Middleware
 * Verifies Bearer token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'No valid token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user still exists and is active
        const result = await query(
            'SELECT id, email, name, role, is_active FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0 || !result.rows[0].is_active) {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'User not found or inactive'
            });
        }

        req.user = result.rows[0];
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                message: 'Please login again'
            });
        }

        return res.status(401).json({
            error: 'Invalid token',
            message: 'Authentication failed'
        });
    }
};

/**
 * Role-based Authorization Middleware
 * @param {string[]} allowedRoles - Array of roles allowed to access
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Not authenticated'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

/**
 * Optional Authentication
 * Attaches user if token present, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const result = await query(
                'SELECT id, email, name, role FROM users WHERE id = $1 AND is_active = true',
                [decoded.userId]
            );

            if (result.rows.length > 0) {
                req.user = result.rows[0];
            }
        }
    } catch (error) {
        // Ignore auth errors for optional auth
    }

    next();
};
