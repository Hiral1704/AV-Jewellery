const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: Verify user authentication
async function protect(req, res, next) {
    try {
        const token = (req.headers.authorization || '')
            .replace(/^Bearer\s+/, '');

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: 'Please log in'
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'dev-jwt-secret-change-me'
        );

        // Find user from database
        req.user = await User.findById(decoded.id)
            .select('-password');

        // Check if account exists
        if (!req.user) {
            return res.status(401).json({
                message: 'Account not found'
            });
        }

        next();

    } catch (e) {
        return res.status(401).json({
            message: 'Invalid or expired session'
        });
    }
}


// Restrict access to admin users only
function adminOnly(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            message: 'Admin access only'
        });
    }

    next();
}


// Export middleware functions
module.exports = {
    protect,
    adminOnly
};