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



const jwt = require('jsonwebtoken'); // 👈 حتما اضافه کن
const User = require('../../../infrastructure/database/models/User');
const generateToken = require('../../../infrastructure/utils/generateToken');
const generateRefreshToken = require('../../../infrastructure/utils/generateRefreshToken');

const loginUser = async (phoneNumber, password) => {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
        throw new Error('کاربری با این شماره یافت نشد.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new Error('رمز عبور اشتباه است.');
    }

    // تولید access token و refresh token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refreshToken = generateRefreshToken(user._id);

    // ذخیره refresh token در دیتابیس (در آرایه)
    user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
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


