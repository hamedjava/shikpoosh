const User = require('../../../../infrastructure/database/models/userModel');
const UserEntity = require('../../../../src/domain/entities/user');

const registerUser = async (name, phoneNumber, email, password) => {
    // بررسی پارامترهای دریافتی
    console.log('Inside registerUser:', { name, phoneNumber, email, password });

    if (!name || !phoneNumber || !email || !password) {
        throw new Error('اطلاعات ناقص است.');
    }

    const existingUser = await User.findOne({ phoneNumber, email });
    if (existingUser) {
        throw new Error('شماره تلفن یا ایمیل قبلاً ثبت‌نام شده است.');
    }

    const user = new User({ name, phoneNumber, email, password });
    await user.save();
    return user;
};


module.exports = registerUser;
