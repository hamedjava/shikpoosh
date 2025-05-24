const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secretkey',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // ← پشتیبانی از .env
    );
};

module.exports = generateToken;
