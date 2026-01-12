/**
 * Reset Admin Password Script
 * Run with: docker exec -it securepent_api node src/scripts/reset-admin.js
 */

import pg from 'pg';
import argon2 from 'argon2';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const DEFAULT_PASSWORD = 'admin123';

async function resetAdminPassword() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: false
    });

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();

        // Find admin user
        const adminResult = await client.query(
            "SELECT id, email, name FROM users WHERE role = 'admin' LIMIT 1"
        );

        if (adminResult.rows.length === 0) {
            console.log('❌ No admin user found!');

            // Create admin user
            console.log('📝 Creating admin user...');
            const passwordHash = await argon2.hash(DEFAULT_PASSWORD, {
                type: argon2.argon2id,
                memoryCost: 65536,
                timeCost: 3,
                parallelism: 4,
            });

            await client.query(
                `INSERT INTO users (email, password_hash, name, role, is_active, email_verified)
                 VALUES ($1, $2, $3, 'admin', true, true)`,
                ['admin@securepent.com', passwordHash, 'admin']
            );

            console.log('✅ Admin user created!');
            console.log('   Email: admin@securepent.com');
            console.log('   Username: admin');
            console.log('   Password: admin123');
        } else {
            const admin = adminResult.rows[0];
            console.log(`📋 Found admin user: ${admin.name} (${admin.email})`);

            // Reset password
            console.log('🔐 Resetting password...');
            const passwordHash = await argon2.hash(DEFAULT_PASSWORD, {
                type: argon2.argon2id,
                memoryCost: 65536,
                timeCost: 3,
                parallelism: 4,
            });

            await client.query(
                'UPDATE users SET password_hash = $1, failed_login_attempts = 0, locked_until = NULL WHERE id = $2',
                [passwordHash, admin.id]
            );

            console.log('✅ Password reset successfully!');
            console.log('');
            console.log('   Login with:');
            console.log(`   Email: ${admin.email}`);
            console.log(`   Password: ${DEFAULT_PASSWORD}`);
            console.log('');
            console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

resetAdminPassword();
