const User = require('../../../infrastructure/database/models/User');
const generateToken = require('../../../infrastructure/utils/generateToken');
const { otpStore } = require('./sendOtp');

const verifyOtp = async (phoneNumber, code) => {
    const otpData = otpStore[phoneNumber];
    if (!otpData || otpData.code !== code || otpData.expiresAt < Date.now()) {
        throw new Error('کد تایید نامعتبر یا منقضی شده است.');
    }

    let user = await User.findOne({ phoneNumber });
    if (!user) {
        // اگر کاربر جدید است، بساز
        user = new User({
            phoneNumber,
            name: 'کاربر جدید',
            email: `${phoneNumber}@otpuser.com`,
            password: 'default',
        });
        await user.save();
    }

    delete otpStore[phoneNumber]; // پاک کردن OTP

    const token = generateToken(user._id);
    return { user, token };
};

module.exports = verifyOtp;
