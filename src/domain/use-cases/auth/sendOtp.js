const generateOTP = require('../../../../src/utils/otpGenerator');
const otpStore = {}; // به صورت ساده در حافظه نگه می‌داریم

const sendOtp = async (phoneNumber) => {
    const otp = generateOTP();
    otpStore[phoneNumber] = { code: otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // ۲ دقیقه اعتبار

    console.log(`📲 OTP for ${phoneNumber}: ${otp}`); // در عمل واقعی، به SMS ارسال میشه

    return true;
};

module.exports = { sendOtp, otpStore };
