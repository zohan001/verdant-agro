/**
 * ============================================
 * Contact Controller
 * ============================================
 * Handles contact message submissions via the API.
 * ============================================
 */

const ContactMessage = require('../models/ContactMessage');
const { logAudit } = require('../db/database');

/**
 * Save a new contact message to the database.
 *
 * @route POST /api/contact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
async function submitContact(req, res) {
    const { name, email, organization = '', subject = 'general', message } = req.body;

    try {
        // Create and save the contact message document
        const contactMessage = await ContactMessage.create({
            name,
            email,
            organization,
            subject,
            message
        });

        // Log the action for auditing purposes (non-blocking)
        logAudit('CONTACT_MESSAGE_CREATED', `Message from ${email}`)
            .catch(err => console.error('[Audit] Failed to log:', err.message));

        // Return success with the created message ID
        return res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully.',
            data: { id: contactMessage._id }
        });
    } catch (err) {
        console.error('[Contact] Failed to save message:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to send your message. Please try again.'
        });
    }
}

/**
 * Get all contact messages (for admin/dashboard use).
 *
 * @route GET /api/contact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
async function getContacts(req, res) {
    try {
        const contacts = await ContactMessage.find()
            .sort({ createdAt: -1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (err) {
        console.error('[Contact] Failed to fetch messages:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch contact messages.'
        });
    }
}

// Export controller actions
module.exports = {
    submitContact,
    getContacts
};
