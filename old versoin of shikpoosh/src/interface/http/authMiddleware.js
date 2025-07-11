// src/interfaces/http/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../../../src/infrastructure/database/models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'توکن یافت نشد یا اشتباه است.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'کاربر یافت نشد.' });
        }

        req.user = user; // ذخیره کاربر در req برای استفاده در کنترلر
        next();
    } catch (error) {
        return res.status(401).json({ message: 'توکن نامعتبر است.' });
    }
};




module.exports = authMiddleware;
