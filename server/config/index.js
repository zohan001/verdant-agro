/**
 * ============================================
 * Server Configuration
 * ============================================
 * Centralized configuration loaded from
 * environment variables with sensible defaults.
 * ============================================
 */

require('dotenv').config();

module.exports = {
    // Server port
    port: process.env.PORT || 3000,

    // Node environment
    env: process.env.NODE_ENV || 'development',

    // MongoDB connection string
    mongoURI: process.env.MONGO_URI,

    // CORS configuration
    cors: {
        origin: process.env.CORS_ORIGIN || '*'
    },

    // Rate limiting configuration (per IP)
    rateLimit: {
        windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes by default
        max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)      // 100 requests per window
    }
};
