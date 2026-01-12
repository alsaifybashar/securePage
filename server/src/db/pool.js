import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // SSL disabled for internal Docker connections
    ssl: false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Test connection on startup
pool.on('connect', () => {
    console.log('📦 Database connection established');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
    process.exit(-1);
});

/**
 * Execute a parameterized query (prevents SQL injection)
 * @param {string} text - SQL query with $1, $2, etc. placeholders
 * @param {Array} params - Parameters to substitute
 * @returns {Promise<pg.QueryResult>}
 */
export const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
        console.log('📊 Query executed:', { text: text.substring(0, 50), duration: `${duration}ms`, rows: res.rowCount });
    }

    return res;
};

/**
 * Get a client for transactions
 * @returns {Promise<pg.PoolClient>}
 */
export const getClient = async () => {
    const client = await pool.connect();
    return client;
};

export default pool;
