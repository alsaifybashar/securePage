/**
 * Database Seed Script
 * Creates initial admin user and test data
 * Run with: npm run db:seed
 */

import argon2 from 'argon2';
import { query } from './pool.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/../../.env` });

async function seedDatabase() {
    try {
        console.log('🌱 Seeding database...\n');

        // Create admin user
        const adminPassword = await argon2.hash('SecureAdmin2026!', {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
        });

        const adminResult = await query(`
            INSERT INTO users (email, password_hash, role, name, company, email_verified)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) DO UPDATE SET
                password_hash = EXCLUDED.password_hash,
                updated_at = CURRENT_TIMESTAMP
            RETURNING id, email, role
        `, ['admin@securepent.com', adminPassword, 'admin', 'System Admin', 'SecurePent', true]);

        console.log('👤 Admin user created/updated:', adminResult.rows[0]);

        // Create demo client user
        const clientPassword = await argon2.hash('demo123', {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
        });

        const clientResult = await query(`
            INSERT INTO users (email, password_hash, role, name, company, email_verified)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) DO UPDATE SET
                password_hash = EXCLUDED.password_hash,
                updated_at = CURRENT_TIMESTAMP
            RETURNING id, email, role
        `, ['demo@securepent.com', clientPassword, 'client', 'Demo User', 'Test Corp', true]);

        console.log('👤 Demo client created/updated:', clientResult.rows[0]);

        // Create sample leads
        const leads = [
            {
                name: 'John Smith',
                email: 'john@example.com',
                company: 'TechCorp Inc.',
                message: 'Interested in Tier 2 Internal Audit for our WordPress multisite.',
                service_tier: 'tier2',
                status: 'new',
                priority: 'high'
            },
            {
                name: 'Sarah Johnson',
                email: 'sarah@startup.io',
                company: 'Startup.io',
                message: 'Need external analysis of our e-commerce WordPress site.',
                service_tier: 'tier1',
                status: 'contacted',
                priority: 'normal'
            }
        ];

        for (const lead of leads) {
            await query(`
                INSERT INTO leads (name, email, company, message, service_tier, status, priority)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT DO NOTHING
            `, [lead.name, lead.email, lead.company, lead.message, lead.service_tier, lead.status, lead.priority]);
        }

        console.log('📧 Sample leads created');

        // Log seed action
        await query(`
            INSERT INTO audit_log (action, entity_type, details, severity)
            VALUES ($1, $2, $3, $4)
        `, ['database_seeded', 'system', JSON.stringify({ timestamp: new Date().toISOString() }), 'info']);

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📝 Default credentials:');
        console.log('   Admin: admin@securepent.com / SecureAdmin2026!');
        console.log('   Demo:  demo@securepent.com / demo123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
}

seedDatabase();
