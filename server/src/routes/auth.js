import { Router } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { query } from '../db/pool.js';
import { logAudit } from '../services/auditService.js';

const router = Router();

// Validation rules
const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must be 8+ chars with uppercase, lowercase, and number'),
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name required (2-100 chars)'),
    body('company').optional().trim().isLength({ max: 255 }),
];

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', loginValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');

        // Find user
        const result = await query(
            'SELECT * FROM users WHERE email = $1 AND is_active = true',
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            await logAudit(null, 'login_failed', 'user', null, ip, userAgent, {
                reason: 'user_not_found',
                email
            }, 'warning');

            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Email or password incorrect'
            });
        }

        // Check if account is locked
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            const remainingMs = new Date(user.locked_until) - new Date();
            const remainingSecs = Math.ceil(remainingMs / 1000);

            return res.status(423).json({
                error: 'Account locked',
                message: `Too many failed attempts. Try again in ${remainingSecs} seconds.`,
                retryAfter: remainingSecs
            });
        }

        // Verify password
        const validPassword = await argon2.verify(user.password_hash, password);

        if (!validPassword) {
            // Increment failed attempts
            const newAttempts = (user.failed_login_attempts || 0) + 1;
            const lockUntil = newAttempts >= 3
                ? new Date(Date.now() + 30000) // 30 second lock
                : null;

            await query(
                'UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3',
                [newAttempts, lockUntil, user.id]
            );

            await logAudit(user.id, 'login_failed', 'user', user.id, ip, userAgent, {
                reason: 'invalid_password',
                attempts: newAttempts
            }, 'warning');

            return res.status(401).json({
                error: 'Invalid credentials',
                message: lockUntil
                    ? 'Account locked for 30 seconds due to failed attempts.'
                    : `Email or password incorrect. ${3 - newAttempts} attempts remaining.`
            });
        }

        // Successful login - reset failed attempts
        await query(
            'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Store session
        const tokenHash = await argon2.hash(token.substring(0, 20));
        await query(
            'INSERT INTO sessions (user_id, token_hash, ip_address, user_agent, expires_at) VALUES ($1, $2, $3, $4, $5)',
            [user.id, tokenHash, ip, userAgent, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
        );

        await logAudit(user.id, 'login_success', 'user', user.id, ip, userAgent, {}, 'info');

        res.json({
            message: 'Authentication successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

/**
 * POST /api/auth/register
 * Register new client account
 */
router.post('/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name, company } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');

        // Check if email exists
        const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({
                error: 'Email already registered',
                message: 'An account with this email already exists'
            });
        }

        // Hash password with Argon2id
        const passwordHash = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
        });

        // Create user
        const result = await query(
            `INSERT INTO users (email, password_hash, name, company, role)
             VALUES ($1, $2, $3, $4, 'client')
             RETURNING id, email, name, role, created_at`,
            [email, passwordHash, name, company || null]
        );

        const newUser = result.rows[0];

        await logAudit(newUser.id, 'user_registered', 'user', newUser.id, ip, userAgent, {}, 'info');

        res.status(201).json({
            message: 'Account created successfully',
            user: newUser
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

/**
 * GET /api/auth/session
 * Verify current session
 */
router.get('/session', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ authenticated: false });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const result = await query(
            'SELECT id, email, name, role, company FROM users WHERE id = $1 AND is_active = true',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ authenticated: false });
        }

        res.json({
            authenticated: true,
            user: result.rows[0]
        });

    } catch (error) {
        res.status(401).json({ authenticated: false });
    }
});

/**
 * POST /api/auth/logout
 * Invalidate session
 */
router.post('/logout', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Delete user sessions
            await query('DELETE FROM sessions WHERE user_id = $1', [decoded.userId]);

            await logAudit(decoded.userId, 'logout', 'user', decoded.userId, req.ip, req.get('User-Agent'), {}, 'info');
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.json({ message: 'Logged out' });
    }
});

export default router;
