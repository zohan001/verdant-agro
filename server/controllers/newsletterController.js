/**
 * ============================================
 * Newsletter Controller
 * ============================================
 * Handles newsletter subscription requests.
 * ============================================
 */

const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { logAudit } = require('../db/database');

/**
 * Subscribe an email address to the newsletter.
 *
 * @route POST /api/newsletter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
async function subscribe(req, res) {
    const { email } = req.body;

    try {
        // Check if the email is already subscribed
        const existing = await NewsletterSubscriber.findOne({ email });

        if (existing) {
            // Already exists - reactivate subscription if it was unsubscribed
            if (!existing.subscribed) {
                existing.subscribed = true;
                await existing.save();
                return res.status(200).json({
                    success: true,
                    message: 'You have been resubscribed. Thank you!'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'You are already subscribed. Thank you for your continued support!'
            });
        }

        // Create a new subscription
        await NewsletterSubscriber.create({ email });

        // Log the subscription action (non-blocking)
        logAudit('NEWSLETTER_SUBSCRIBE', email)
            .catch(err => console.error('[Audit] Failed to log:', err.message));

        return res.status(201).json({
            success: true,
            message: 'Thank you for subscribing! You\'ll receive our latest updates.'
        });
    } catch (err) {
        // Handle duplicate key error (race condition on unique email)
        if (err.code === 11000) {
            return res.status(200).json({
                success: true,
                message: 'You are already subscribed!'
            });
        }

        console.error('[Newsletter] Failed to process subscription:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to process subscription. Please try again.'
        });
    }
}

/**
 * Get all newsletter subscribers (admin use).
 *
 * @route GET /api/newsletter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
async function getSubscribers(req, res) {
    try {
        const subscribers = await NewsletterSubscriber.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: subscribers.length,
            data: subscribers
        });
    } catch (err) {
        console.error('[Newsletter] Failed to fetch subscribers:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribers.'
        });
    }
}

// Export controller actions
module.exports = {
    subscribe,
    getSubscribers
};
