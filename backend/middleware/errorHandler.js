/**
 * Error Handler Middleware
 * Centralized error handling for the API
 */

const errorHandler = (err, req, res, next) => {
    // Log the error
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    // Determine status code
    let statusCode = err.statusCode || err.status || 500;

    // Don't expose internal errors in production
    let message = err.message;
    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        message = 'An internal server error occurred';
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { errorHandler };
