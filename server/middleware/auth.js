const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

async function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please provide a valid token.'
        });
    }

    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists.'
            });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
}

async function optionalAuthenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return next();
    }

    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
            req.user = user;
        }
        next();
    } catch (err) {
        // Invalid token: continue unauthenticated instead of rejecting.
        next();
    }
}

function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.'
            });
        }
        next();
    };
}

module.exports = { authenticate, optionalAuthenticate, authorize };
