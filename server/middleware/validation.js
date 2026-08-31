/**
 * ============================================
 * Validation Middleware
 * ============================================
 * Provides reusable validation functions for
 * incoming requests to ensure data integrity
 * and security.
 * ============================================
 */

/**
 * Validate a contact message submission.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function validateContactMessage(req, res, next) {
    const { name, email, subject, message } = req.body;
    const errors = [];

    // Validate name
    if (!name || !name.trim()) {
        errors.push({ field: 'name', message: 'Full name is required.' });
    } else if (name.trim().length < 2 || name.trim().length > 100) {
        errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters.' });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
        errors.push({ field: 'email', message: 'Email address is required.' });
    } else if (!emailRegex.test(email)) {
        errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }

    // Validate subject (optional field, but if provided should be a string)
    if (subject && typeof subject !== 'string') {
        errors.push({ field: 'subject', message: 'Subject must be a string.' });
    }

    // Validate message
    if (!message || !message.trim()) {
        errors.push({ field: 'message', message: 'Message is required.' });
    } else if (message.trim().length < 10) {
        errors.push({ field: 'message', message: 'Message must be at least 10 characters long.' });
    } else if (message.trim().length > 1000) {
        errors.push({ field: 'message', message: 'Message cannot exceed 1000 characters.' });
    }

    // If there are errors, return 400 with error details
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    // Trim the input and sanitize
    req.body.name = name.trim();
    req.body.email = email.trim().toLowerCase();
    req.body.organization = (req.body.organization || '').trim();
    req.body.subject = subject || 'general';
    req.body.message = message.trim();

    next();
}

/**
 * Validate a newsletter subscription.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function validateNewsletter(req, res, next) {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !email.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Email address is required.',
            errors: [{ field: 'email', message: 'Email address is required.' }]
        });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address.',
            errors: [{ field: 'email', message: 'Please provide a valid email address.' }]
        });
    }

    // Normalize email
    req.body.email = email.trim().toLowerCase();

    next();
}

/**
 * Global error handling middleware.
 * Catches any unhandled errors in the application.
 *
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function errorHandler(err, req, res, next) {
    console.error('[ERROR]', err.message);
    console.error(err.stack);

    // Return a generic error message - don't leak internals
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

/**
 * 404 handler for unknown API routes.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: 'Resource not found.'
    });
}

// Export all validation and error handling middleware
module.exports = {
    validateContactMessage,
    validateNewsletter,
    errorHandler,
    notFoundHandler
};
