// // src/interfaces/http/middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');
// const User = require('../../../src/infrastructure/database/models/User');

// const authMiddleware = async (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'توکن یافت نشد یا اشتباه است.' });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.id).select('-password');
//         if (!user) {
//             return res.status(401).json({ message: 'کاربر یافت نشد.' });
//         }

//         req.user = user; // ذخیره کاربر در req برای استفاده در کنترلر
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: 'توکن نامعتبر است.' });
//     }
// };
// module.exports = authMiddleware;


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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'کاربر یافت نشد.' });
        }

        req.user = user;
        req.token = token; // توکن فعلی را هم ذخیره کن برای logout در آینده
        next();
    } catch (error) {
        return res.status(401).json({ message: 'توکن نامعتبر است یا منقضی شده است.' });
    }
};


const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'توکن دسترسی یافت نشد.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'accesskey');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد.' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'توکن نامعتبر یا منقضی شده.' });
  }
};
  
module.exports = {authMiddleware,authenticate};

