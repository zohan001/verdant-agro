/**
 * ============================================
 * Audit Log Model
 * ============================================
 * Mongoose schema for tracking important
 * system events for auditing purposes.
 * ============================================
 */

const mongoose = require('mongoose');

/**
 * AuditLog schema
 * Stores a record of important system events.
 */
const auditLogSchema = new mongoose.Schema(
    {
        // The action that was performed
        action: {
            type: String,
            required: [true, 'Action is required.'],
            trim: true
        },

        // Additional details about the action
        details: {
            type: String,
            trim: true,
            default: null
        }
    },
    {
        // Automatically add createdAt timestamp
        timestamps: { createdAt: true, updatedAt: false }
    }
);

// Create and export the model
module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
