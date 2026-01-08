/**
 * Global Error Handler Middleware
 */

export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Determine status code
    const statusCode = err.statusCode || err.status || 500;

    // Don't leak internal errors in production
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal server error'
        : err.message;

    // Log detailed error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Stack:', err.stack);
    }

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.details
        })
    });
};

/**
 * Not Found Handler
 */
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
};
