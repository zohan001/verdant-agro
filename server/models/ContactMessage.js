/**
 * ============================================
 * Contact Message Model
 * ============================================
 * Mongoose schema representing a contact form
 * submission stored in MongoDB.
 * ============================================
 */

const mongoose = require('mongoose');

/**
 * ContactMessage schema
 * Represents a contact inquiry submitted via the
 * website's contact form.
 */
const contactMessageSchema = new mongoose.Schema(
    {
        // Full name of the person submitting the form
        name: {
            type: String,
            required: [true, 'Full name is required.'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters.'],
            maxlength: [100, 'Name cannot exceed 100 characters.']
        },

        // Email address of the submitter
        email: {
            type: String,
            required: [true, 'Email address is required.'],
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address.']
        },

        // Optional organization name
        organization: {
            type: String,
            trim: true,
            maxlength: [200, 'Organization cannot exceed 200 characters.'],
            default: ''
        },

        // Subject category of the inquiry
        subject: {
            type: String,
            trim: true,
            default: 'general'
        },

        // The message content
        message: {
            type: String,
            required: [true, 'Message is required.'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters.'],
            maxlength: [1000, 'Message cannot exceed 1000 characters.']
        },

        // Processing status of the message
        status: {
            type: String,
            enum: ['new', 'in_progress', 'resolved'],
            default: 'new'
        }
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true
    }
);

// Create and export the model
module.exports = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
