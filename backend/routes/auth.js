/**
 * Authentication Routes
 * Secure admin authentication with JWT
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { sanitizeString } = require('../utils/sanitize');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * POST /api/auth/login
 * Admin login
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Sanitize username
        const sanitizedUsername = sanitizeString(username, { maxLength: 50, toLowerCase: true });

        if (!sanitizedUsername || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username and password are required'
            });
        }

        // Get admin user
        const stmt = db.prepare('SELECT * FROM admin_users WHERE username = ?');
        let user = stmt.get(sanitizedUsername);

        // If no admin users exist at all, create the default admin
        if (!user) {
            const countStmt = db.prepare('SELECT COUNT(*) as count FROM admin_users');
            const { count } = countStmt.get();

            // Only create default admin if no users exist AND username is 'admin'
            if (count === 0 && sanitizedUsername === 'admin') {
                console.log('📝 Creating default admin user...');
                const defaultHash = await bcrypt.hash('admin123', 12);
                const insertStmt = db.prepare(`
                    INSERT INTO admin_users (username, password_hash, role)
                    VALUES (?, ?, 'superadmin')
                `);
                insertStmt.run('admin', defaultHash);
                user = stmt.get('admin');
                console.log('✅ Default admin user created');
            }
        }

        if (!user) {
            // Log failed attempt
            console.warn(`⚠️ Failed login attempt for unknown user: ${sanitizedUsername}`);

            // Use consistent response time to prevent timing attacks
            await bcrypt.compare(password, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.FzS5H1nQxKgB3S');

            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if account is locked
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            return res.status(423).json({
                success: false,
                error: 'Account is temporarily locked. Please try again later.',
                lockedUntil: user.locked_until
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            // Increment failed attempts
            const failedAttempts = (user.failed_attempts || 0) + 1;
            let lockedUntil = null;

            // Lock account after 5 failed attempts
            if (failedAttempts >= 5) {
                lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
                console.warn(`🔒 Account locked due to failed attempts: ${sanitizedUsername}`);
            }

            const updateStmt = db.prepare(`
                UPDATE admin_users 
                SET failed_attempts = ?, locked_until = ?
                WHERE id = ?
            `);
            updateStmt.run(failedAttempts, lockedUntil, user.id);

            // Log to audit
            const auditStmt = db.prepare(`
                INSERT INTO admin_audit_log (admin_id, action, ip_address, user_agent)
                VALUES (?, 'login_failed', ?, ?)
            `);
            auditStmt.run(
                user.id,
                req.ip || '',
                req.headers['user-agent'] || ''
            );

            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Successful login - reset failed attempts and update last login
        const updateStmt = db.prepare(`
            UPDATE admin_users 
            SET failed_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        updateStmt.run(user.id);

        // Log successful login to audit
        const auditStmt = db.prepare(`
            INSERT INTO admin_audit_log (admin_id, action, ip_address, user_agent)
            VALUES (?, 'login_success', ?, ?)
        `);
        auditStmt.run(
            user.id,
            req.ip || '',
            req.headers['user-agent'] || ''
        );

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        console.log(`✅ Admin login successful: ${sanitizedUsername}`);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            },
            expiresIn: JWT_EXPIRES_IN
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred during authentication'
        });
    }
});

/**
 * POST /api/auth/logout
 * Admin logout (client should discard token)
 */
router.post('/logout', (req, res) => {
    // JWT is stateless, so logout is handled client-side
    // We can log this action if needed
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

/**
 * POST /api/auth/change-password
 * Change admin password
 */
router.post('/change-password', async (req, res) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Current and new password are required'
            });
        }

        // Password strength validation
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                error: 'New password must be at least 8 characters long'
            });
        }

        // Get user
        const stmt = db.prepare('SELECT * FROM admin_users WHERE id = ?');
        const user = stmt.get(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Current password is incorrect' });
        }

        // Hash new password
        const newHash = await bcrypt.hash(newPassword, 12);

        // Update password
        const updateStmt = db.prepare(`
            UPDATE admin_users 
            SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        updateStmt.run(newHash, user.id);

        // Log to audit
        const auditStmt = db.prepare(`
            INSERT INTO admin_audit_log (admin_id, action, ip_address, user_agent)
            VALUES (?, 'password_changed', ?, ?)
        `);
        auditStmt.run(user.id, req.ip || '', req.headers['user-agent'] || '');

        console.log(`✅ Password changed for: ${user.username}`);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }
        console.error('Password change error:', error);
        res.status(500).json({ success: false, error: 'Failed to change password' });
    }
});

/**
 * PUT /api/auth/update-username
 * Change admin username
 */
router.put('/update-username', async (req, res) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const { currentPassword, newUsername } = req.body;

        if (!currentPassword || !newUsername) {
            return res.status(400).json({
                success: false,
                error: 'Current password and new username are required'
            });
        }

        // Sanitize new username
        const sanitizedUsername = sanitizeString(newUsername, { maxLength: 50, toLowerCase: true });

        if (!sanitizedUsername || sanitizedUsername.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Username must be at least 3 characters long'
            });
        }

        // Get user
        const stmt = db.prepare('SELECT * FROM admin_users WHERE id = ?');
        const user = stmt.get(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Current password is incorrect' });
        }

        // Check if username already exists
        const checkStmt = db.prepare('SELECT id FROM admin_users WHERE username = ? AND id != ?');
        const existingUser = checkStmt.get(sanitizedUsername, user.id);

        if (existingUser) {
            return res.status(409).json({ success: false, error: 'Username already taken' });
        }

        // Update username
        const updateStmt = db.prepare(`
            UPDATE admin_users 
            SET username = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        updateStmt.run(sanitizedUsername, user.id);

        // Log to audit
        const auditStmt = db.prepare(`
            INSERT INTO admin_audit_log (admin_id, action, ip_address, user_agent)
            VALUES (?, 'username_changed', ?, ?)
        `);
        auditStmt.run(user.id, req.ip || '', req.headers['user-agent'] || '');

        // Generate new token with updated username
        const newToken = jwt.sign(
            {
                id: user.id,
                username: sanitizedUsername,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        console.log(`✅ Username changed from ${user.username} to ${sanitizedUsername}`);

        res.json({
            success: true,
            message: 'Username updated successfully',
            user: {
                id: user.id,
                username: sanitizedUsername,
                role: user.role
            },
            token: newToken // Client should update token
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }
        console.error('Username update error:', error);
        res.status(500).json({ success: false, error: 'Failed to update username' });
    }
});

module.exports = router;
