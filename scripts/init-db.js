/**
 * ============================================
 * Database Initialization Script
 * ============================================
 * Connects to MongoDB and verifies the connection
 * and indexes. Run before the first server start
 * or to verify the database is reachable.
 *
 * Usage: npm run init-db
 * ============================================
 */

require('dotenv').config();

async function initDb() {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        console.error('[Init] MONGO_URI environment variable is required.');
        process.exit(1);
    }

    const { connectDB, initializeDatabase, logAudit, closeDatabase } = require('../server/db/database');

    console.log('[Init] Connecting to MongoDB...');

    try {
        await connectDB();
        await initializeDatabase();

        // Log the initialization event
        await logAudit('DB_INIT', 'MongoDB schema and indexes initialized successfully');

        console.log('[Init] Database initialized and verified successfully.');
    } catch (err) {
        console.error('[Init] Failed to initialize database:', err.message);
        process.exitCode = 1;
    } finally {
        await closeDatabase();
    }
}

initDb();
