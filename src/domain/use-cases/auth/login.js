const User = require('../../../../infrastructure/database/models/userModel');
const UserEntity = require('../../../../src/domain/entities/user');

const loginUser = async (phoneNumber, password) => {
    const user = await User.findOne({ phoneNumber });
    if (!user) throw new Error('کاربری با این شماره یافت نشد.');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new Error('پسورد اشتباه است.');

    return user;
};

module.exports = loginUser;
