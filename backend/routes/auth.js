
const router = require('express').Router();

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { protect } = require('../middleware/auth');

// Generate JWT Token
const sign = user =>
    jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET || 'dev-jwt-secret-change-me',
        {
            expiresIn: '7d'
        }
    );

// Safe User Data
const safe = u => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone
});

// User Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters'
            });
        }

        if (await User.findOne({ email: email.toLowerCase() })) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            phone,
            role: 'customer'
        });

        res.status(201).json({
            token: sign(user),
            user: safe(user)
        });

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: (req.body.email || '').toLowerCase()
        });

        if (
            !user ||
            !await user.comparePassword(req.body.password || '')
        ) {
            return res.status(401).json({
                message: 'Incorrect email or password'
            });
        }

        res.json({
            token: sign(user),
            user: safe(user)
        });

    } catch (e) {
        res.status(500).json({
            message: 'Login failed'
        });
    }
});

// Get Logged-In User Profile
router.get('/me', protect, (req, res) =>
    res.json({
        user: safe(req.user)
    })
);

// Update User Profile
router.put('/me', protect, async (req, res) => {
    try {
        req.user.name = req.body.name || req.user.name;
        req.user.phone = req.body.phone ?? req.user.phone;

        await req.user.save();

        res.json({
            user: safe(req.user)
        });

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const email = (req.body.email || '').toLowerCase();

        const generic =
            'If this email is registered, reset instructions are available.';

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                message: generic
            });
        }

        const token = crypto.randomBytes(24).toString('hex');

        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 30 * 60 * 1000;

        await user.save();

        res.json({
            message: 'Development mode: reset token generated. Check the response or backend terminal.',
            devToken: process.env.NODE_ENV === 'production'
                ? undefined
                : token
        });

    } catch (e) {
        res.status(500).json({
            message: 'Could not create reset token'
        });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, token, password } = req.body;

        const user = await User.findOne({
            email: (email || '').toLowerCase(),
            resetToken: token,
            resetTokenExpires: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset token'
            });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters'
            });
        }

        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();

        res.json({
            message: 'Password updated successfully'
        });

    } catch (e) {
        res.status(400).json({
            message: e.message
        });
    }
});

module.exports = router;
