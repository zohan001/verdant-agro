/**
 * ============================================
 * Express Application Factory
 * ============================================
 * Creates and configures the Express application
 * with middleware, routes, static files, and
 * error handling. Exported independently of
 * server startup for testability.
 * ============================================
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import configuration
const config = require('./config');

// Import routes
const apiRoutes = require('./routes/api');

// Import error handling middleware
const { errorHandler, notFoundHandler } = require('./middleware/validation');

/**
 * Create and configure the Express application.
 *
 * @returns {Object} The configured Express app
 */
function createApp() {
    const app = express();

    // ==============================
    // Apply Security Middleware
    // ==============================

    // Use helmet for security headers
    app.use(helmet());

    // Enable CORS for cross-origin requests
    app.use(cors({
        origin: config.cors.origin,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Accept'],
        credentials: false
    }));

    // Parse JSON request bodies with a size limit
    app.use(express.json({ limit: '10mb' }));

    // Parse URL-encoded request bodies
    app.use(express.urlencoded({ extended: false }));

    // Apply rate limiting to all API requests
    const limiter = rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Too many requests, please try again later.'
        }
    });

    // Apply rate limiter to API routes
    app.use('/api', limiter);

    // ==============================
    // Static Files
    // ==============================

    // Serve static frontend files from public directory
    app.use(express.static('public'));

    // Legal pages (serve the static HTML at clean /privacy and /terms URLs)
    app.get('/privacy', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'privacy.html'));
    });
    app.get('/terms', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'terms.html'));
    });

    // ==============================
    // API Routes
    // ==============================

    // Mount all API routes under /api
    app.use('/api', apiRoutes);

    // ==============================
    // Error Handling
    // ==============================

    // Handle 404 for unknown API routes
    app.use('/api', notFoundHandler);

    // Global error handler
    app.use(errorHandler);

    return app;
}

// Export the app factory
module.exports = createApp;
