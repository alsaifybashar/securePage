/**
 * Request Logger Middleware
 * Logs all incoming requests for debugging and security monitoring
 */

const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log request
    const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        ip: req.headers['x-forwarded-for']?.split(',')[0] || req.ip,
        userAgent: req.headers['user-agent']?.substring(0, 100)
    };

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;

        // Color code based on status
        let statusColor = '\x1b[32m'; // Green for 2xx
        if (statusCode >= 400 && statusCode < 500) statusColor = '\x1b[33m'; // Yellow for 4xx
        if (statusCode >= 500) statusColor = '\x1b[31m'; // Red for 5xx

        console.log(
            `${statusColor}${logData.method}\x1b[0m ${logData.path} ` +
            `${statusColor}${statusCode}\x1b[0m ${duration}ms ` +
            `[${logData.ip}]`
        );
    });

    next();
};

module.exports = { requestLogger };
