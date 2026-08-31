/**
 * ============================================
 * Newsletter Subscriber Model
 * ============================================
 * Mongoose schema representing a newsletter
 * subscription stored in MongoDB.
 * ============================================
 */

const mongoose = require('mongoose');

/**
 * NewsletterSubscriber schema
 * Represents an email subscribed to the newsletter.
 */
const newsletterSubscriberSchema = new mongoose.Schema(
    {
        // Email address of the subscriber (must be unique)
        email: {
            type: String,
            required: [true, 'Email address is required.'],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address.']
        },

        // Whether the subscriber is active
        subscribed: {
            type: Boolean,
            default: true
        }
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true
    }
);

// Create and export the model
module.exports = mongoose.models.NewsletterSubscriber || mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
