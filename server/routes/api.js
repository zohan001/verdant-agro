/**
 * ============================================
 * API Routes
 * ============================================
 * Mounts all API endpoint controllers.
 * ============================================
 */

const express = require('express');
const router = express.Router();

// Import controllers
const contactController = require('../controllers/contactController');
const newsletterController = require('../controllers/newsletterController');

// Import validation middleware
const {
    validateContactMessage,
    validateNewsletter
} = require('../middleware/validation');

// ==============================
// Contact Message Routes
// ==============================

// POST /api/contact - Submit a contact message
router.post('/contact', validateContactMessage, contactController.submitContact);

// GET /api/contact - Get all contact messages (admin)
router.get('/contact', contactController.getContacts);

// ==============================
// Newsletter Routes
// ==============================

// POST /api/newsletter - Subscribe to newsletter
router.post('/newsletter', validateNewsletter, newsletterController.subscribe);

// GET /api/newsletter - Get all subscribers (admin)
router.get('/newsletter', newsletterController.getSubscribers);

// ==============================
// Health Check
// ==============================

// GET /api/health - Service health check
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = router;
