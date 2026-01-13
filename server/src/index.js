import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import leadsRoutes from './routes/leads.js';
import cookiesRoutes from './routes/cookies.js';
import healthRoutes from './routes/health.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (Nginx) for correct IP detection and rate limiting
app.set('trust proxy', 1);

// ===========================================
// Security Middleware
// ===========================================

// Helmet - Secure HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// CORS Configuration - Allow multiple origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:8080')
    .split(',')
    .map(origin => origin.trim());

// Add production domains if not already present
if (!allowedOrigins.includes('https://securepent.com')) {
    allowedOrigins.push('https://securepent.com');
}
if (!allowedOrigins.includes('https://www.securepent.com')) {
    allowedOrigins.push('https://www.securepent.com');
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, same-origin)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            console.warn(`CORS blocked request from: ${origin}`);
            return callback(new Error('CORS policy does not allow this origin'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
}));

// Rate Limiting - Protect against brute force
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        error: 'Too many requests. Please try again later.'
    },
    standardHeaders: false,  // Don't expose rate limit info in headers
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: 'Too many attempts. Please try again later.'
    },
    standardHeaders: false,
    legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);

// ===========================================
// Body Parsing & Logging
// ===========================================

app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(requestLogger);

// ===========================================
// API Routes
// ===========================================

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/contact', leadsRoutes);  // Alias for frontend compatibility
app.use('/api/cookies', cookiesRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'SecurePent API',
        version: '1.0.0',
        status: 'operational',
        documentation: '/api/health'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path
    });
});

// Global Error Handler
app.use(errorHandler);

// ===========================================
// Server Start
// ===========================================

app.listen(PORT, () => {
    console.log('\n🔒 ═══════════════════════════════════════════════════════');
    console.log('   SECUREPENT API SERVER');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   🚀 Server running on http://localhost:${PORT}`);
    console.log(`   🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log('═══════════════════════════════════════════════════════════\n');
});

export default app;
