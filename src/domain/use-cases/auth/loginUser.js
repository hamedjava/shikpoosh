// src/use-cases/auth/loginUser.js
const User = require('../../../infrastructure/database/models/User');
const generateToken = require('../../../infrastructure/utils/generateToken');

const loginUser = async (phoneNumber, password) => {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
        throw new Error('کاربری با این شماره یافت نشد.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new Error('رمز عبور اشتباه است.');
    }

    const token = generateToken(user._id, user.role);

    return {
        token,
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
