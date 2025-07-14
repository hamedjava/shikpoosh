// // src/use-cases/auth/loginUser.js
// const User = require('../../../infrastructure/database/models/User');
// const generateToken = require('../../../infrastructure/utils/generateToken');

// const loginUser = async (phoneNumber, password) => {
//     const user = await User.findOne({ phoneNumber });

//     if (!user) {
//         throw new Error('کاربری با این شماره یافت نشد.');
//     }

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//         throw new Error('رمز عبور اشتباه است.');
//     }

//     const token = generateToken(user._id, user.role);

//     return {
//         token,
//         user: {
//             _id: user._id,
//             name: user.name,
//             phoneNumber: user.phoneNumber,
//             email: user.email,
//             role: user.role
//         }
//     };
// };

// module.exports = loginUser;
// src/use-cases/auth/loginUser.js



// const jwt = require('jsonwebtoken'); // 👈 حتما اضافه کن
// const User = require('../../../infrastructure/database/models/User');
// const generateToken = require('../../../infrastructure/utils/generateToken');
// const generateRefreshToken = require('../../../infrastructure/utils/generateRefreshToken');

// const loginUser = async (phoneNumber, password) => {
//     const user = await User.findOne({ phoneNumber });

//     if (!user) {
//         throw new Error('کاربری با این شماره یافت نشد.');
//     }

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//         throw new Error('رمز عبور اشتباه است.');
//     }

//     // تولید access token و refresh token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });

//     const refreshToken = generateRefreshToken(user._id);

//     // ذخیره refresh token در دیتابیس (در آرایه)
//     user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
//     await user.save();

//     return {
//         token,
//         refreshToken,
//         user: {
//             _id: user._id,
//             name: user.name,
//             phoneNumber: user.phoneNumber,
//             email: user.email,
//             role: user.role
//         }
//     };
// };

// module.exports = loginUser;


const jwt = require('jsonwebtoken');
const User = require('../../../infrastructure/database/models/User');
const generateToken = require('../../../infrastructure/utils/generateToken');
const generateRefreshToken = require('../../../infrastructure/utils/generateRefreshToken');

/**
 * 
 * @param {string} phoneNumber 
 * @param {string} password 
 * @param {object} req Express request object for reading headers & IP
 * @returns 
 */
const loginUser = async (phoneNumber, password, req) => {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
        throw new Error('کاربری با این شماره یافت نشد.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new Error('رمز عبور اشتباه است.');
    }

    // توکن دسترسی
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // رفرش‌توکن
    const refreshToken = generateRefreshToken(user._id);

    // اطلاعات دستگاه فعلی
    const deviceData = {
        token: refreshToken,
        userAgent: req.headers['user-agent'] || 'unknown',
        ip: req.ip || req.connection.remoteAddress || 'unknown',
        createdAt: new Date()
    };

    // ذخیره در آرایه
    user.refreshTokens = [...(user.refreshTokens || []), deviceData];
    await user.save();

    return {
        token,
        refreshToken,
        user: {
            _id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = loginUser;
