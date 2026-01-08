/**
 * Request Logger Middleware
 * Logs all incoming requests with timing
 */

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log on response finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
        const reset = '\x1b[0m';

        console.log(
            `${new Date().toISOString()} | ${statusColor}${status}${reset} | ${duration}ms | ${req.method} ${req.path}`
        );
    });

    next();
};
