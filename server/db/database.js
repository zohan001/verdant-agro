/**
 * ============================================
 * Database Module
 * ============================================
 * Handles the MongoDB connection using Mongoose
 * and exports the connection and helper functions.
 * ============================================
 */

const mongoose = require('mongoose');

// Import audit log model for the logAudit helper
const AuditLog = require('../models/AuditLog');

// Import environment configuration
require('dotenv').config();

/**
 * Establish a connection to MongoDB.
 *
 * Uses the MONGO_URI environment variable.
 *
 * @returns {Promise<void>} Resolves when connected
 */
async function connectDB() {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        // Fail fast with a clear message if no connection string is provided
        throw new Error(
            'MONGO_URI environment variable is not set. ' +
            'Please provide a MongoDB connection string.'
        );
    }

    try {
        // Connect to MongoDB with connection options
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000, // Fail after 15s if no server
            maxPoolSize: 10 // Limit connection pool
        });
        console.log('[DB] Connected to MongoDB successfully.');
    } catch (err) {
        console.error('[DB] Failed to connect to MongoDB:', err.message);
        throw err;
    }
}

/**
 * Initialize the database - creates indexes.
 * Runs after connectDB.
 *
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
    // Ensure indexes are built for models with unique constraints
    // (e.g., NewsletterSubscriber email unique index)
    await Promise.all(Object.values(mongoose.models).map(model => model.init()));
    console.log('[DB] MongoDB indexes initialized.');
}

/**
 * Log an action to the audit log collection.
 *
 * @param {string} action - The action performed
 * @param {string|null} details - Additional details about the action
 * @returns {Promise<void>}
 */
async function logAudit(action, details = null) {
    try {
        await AuditLog.create({ action, details });
    } catch (err) {
        console.error('[DB] Failed to log audit action:', err.message);
    }
}

/**
 * Close the MongoDB connection.
 * Used for graceful shutdown.
 *
 * @param {boolean} force - Force close even with pending operations
 * @returns {Promise<void>}
 */
async function closeDatabase(force = false) {
    if (force) {
        await mongoose.connection.close(true);
    } else {
        await mongoose.connection.close();
    }
    console.log('[DB] MongoDB connection closed.');
}

// Export shared database helpers and the mongoose instance
module.exports = {
    connectDB,
    initializeDatabase,
    logAudit,
    closeDatabase,
    mongoose
};
