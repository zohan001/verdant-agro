const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

function generateToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });
}

async function register(req, res) {
    const { name, email, password, role } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        const user = await User.create({ name, email, password, role });
        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully.',
            data: { user, token }
        });
    } catch (err) {
        console.error('[Auth] Registration failed:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: { user, token }
        });
    } catch (err) {
        console.error('[Auth] Login failed:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
}

async function getProfile(req, res) {
    return res.status(200).json({
        success: true,
        data: { user: req.user }
    });
}

module.exports = { register, login, getProfile };
