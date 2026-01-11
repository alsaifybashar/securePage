/**
 * Database Configuration and Connection
 * Uses better-sqlite3 for synchronous, fast SQLite operations
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'securepent.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database tables
const initDatabase = () => {
    // Contacts table - stores form submissions
    db.exec(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT UNIQUE NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            company TEXT,
            job_title TEXT,
            message TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            referrer TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            read_at DATETIME,
            archived_at DATETIME,
            status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied', 'archived'))
        )
    `);

    // Analytics sessions table
    db.exec(`
        CREATE TABLE IF NOT EXISTS analytics_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            visitor_id TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            referrer TEXT,
            landing_page TEXT,
            device_type TEXT,
            browser TEXT,
            os TEXT,
            country TEXT,
            city TEXT,
            started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            ended_at DATETIME,
            page_views INTEGER DEFAULT 0,
            total_time_seconds INTEGER DEFAULT 0
        )
    `);

    // Analytics events table - tracks page views, clicks, etc.
    db.exec(`
        CREATE TABLE IF NOT EXISTS analytics_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            event_type TEXT NOT NULL,
            event_data TEXT,
            page_url TEXT,
            element_id TEXT,
            element_class TEXT,
            element_text TEXT,
            x_position INTEGER,
            y_position INTEGER,
            scroll_depth INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES analytics_sessions(session_id)
        )
    `);

    // Admin users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            email TEXT,
            role TEXT DEFAULT 'admin' CHECK(role IN ('admin', 'superadmin')),
            last_login DATETIME,
            failed_attempts INTEGER DEFAULT 0,
            locked_until DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Admin audit log - tracks all admin actions
    db.exec(`
        CREATE TABLE IF NOT EXISTS admin_audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_id INTEGER,
            action TEXT NOT NULL,
            entity_type TEXT,
            entity_id TEXT,
            old_value TEXT,
            new_value TEXT,
            ip_address TEXT,
            user_agent TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES admin_users(id)
        )
    `);

    // Create indexes for performance
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
        CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
        CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON analytics_sessions(started_at);
        CREATE INDEX IF NOT EXISTS idx_events_session_id ON analytics_events(session_id);
        CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at);
        CREATE INDEX IF NOT EXISTS idx_events_event_type ON analytics_events(event_type);
    `);

    console.log('✅ Database initialized successfully');
};

// Initialize on module load
initDatabase();

module.exports = db;
