// src/use-cases/auth/loginUser.js
const User = require('../../../infrastructure/database/models/User');

const loginUser = async (phoneNumber, password) => {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
        throw new Error('کاربری با این شماره یافت نشد.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new Error('رمز عبور اشتباه است.');
    }

    return user;
};

module.exports = loginUser;
