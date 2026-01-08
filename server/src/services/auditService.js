import { query } from '../db/pool.js';

/**
 * Log an audit event to the database
 * @param {string|null} userId - User ID (null for anonymous actions)
 * @param {string} action - Action performed (e.g., 'login_success', 'lead_created')
 * @param {string} entityType - Type of entity affected (e.g., 'user', 'lead')
 * @param {string|null} entityId - ID of the affected entity
 * @param {string} ipAddress - Client IP address
 * @param {string} userAgent - Client user agent
 * @param {object} details - Additional details as JSON
 * @param {string} severity - Log severity ('debug', 'info', 'warning', 'error', 'critical')
 */
export const logAudit = async (
    userId,
    action,
    entityType,
    entityId,
    ipAddress,
    userAgent,
    details = {},
    severity = 'info'
) => {
    try {
        await query(`
            INSERT INTO audit_log (user_id, action, entity_type, entity_id, ip_address, user_agent, details, severity)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            userId,
            action,
            entityType,
            entityId,
            ipAddress,
            userAgent,
            JSON.stringify(details),
            severity
        ]);
    } catch (error) {
        // Don't throw - audit logging should not break main flow
        console.error('Audit log error:', error.message);
    }
};

/**
 * Get recent audit logs
 * @param {object} filters - Filtering options
 * @returns {Promise<Array>}
 */
export const getAuditLogs = async (filters = {}) => {
    const { userId, action, severity, limit = 100, offset = 0 } = filters;

    let queryText = 'SELECT * FROM audit_log WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (userId) {
        paramCount++;
        queryText += ` AND user_id = $${paramCount}`;
        params.push(userId);
    }

    if (action) {
        paramCount++;
        queryText += ` AND action = $${paramCount}`;
        params.push(action);
    }

    if (severity) {
        paramCount++;
        queryText += ` AND severity = $${paramCount}`;
        params.push(severity);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
};
