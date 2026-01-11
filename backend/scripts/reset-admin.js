/**
 * Reset Admin Password Script
 * Usage: node scripts/reset-admin.js
 * 
 * Resets the 'admin' user password to 'admin123' or creates the user if doesn't exist.
 */

const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/securepent.db');
const db = new Database(dbPath);

async function resetAdmin() {
    console.log('🔄 Admin Password Reset Tool');
    console.log('----------------------------');

    try {
        const username = 'admin';
        const defaultPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 12);

        // Check if user exists
        const stmt = db.prepare('SELECT * FROM admin_users WHERE username = ?');
        const user = stmt.get(username);

        if (user) {
            console.log(`User '${username}' found. Resetting password...`);

            const updateStmt = db.prepare(`
                UPDATE admin_users 
                SET password_hash = ?, failed_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `);
            updateStmt.run(hashedPassword, user.id);

            console.log('✅ Password successfully reset.');
        } else {
            console.log(`User '${username}' not found. Creating new admin user...`);

            const insertStmt = db.prepare(`
                INSERT INTO admin_users (username, password_hash, role)
                VALUES (?, ?, 'superadmin')
            `);
            insertStmt.run(username, hashedPassword);

            console.log('✅ New admin user created.');
        }

        console.log(`\nDefault Credentials:`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${defaultPassword}`);
        console.log(`\n⚠️  IMPORTANT: Log in and change this password immediately!`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

resetAdmin();
