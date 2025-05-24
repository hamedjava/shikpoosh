const jwt = require('jsonwebtoken');
const Otp = require('../../../infrastructure/database/models/otpModel');
const User = require('../../../infrastructure/database/models/User');
const generateToken = require('../../../infrastructure/utils/generateToken'); // اگر استفاده نمی‌کنی، حذفش کن

const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'شماره و کد تأیید الزامی هستند.' });
  }

  try {
    const record = await Otp.findOne({ phoneNumber, otpCode: otp });

    if (!record) {
      return res.status(401).json({ message: 'کد تأیید اشتباه است.' });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(401).json({ message: 'کد تأیید منقضی شده است.' });
    }

    // ثبت یا پیدا کردن کاربر (در صورت نیاز)
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({ phoneNumber });
    }

    // تولید توکن با اعتبار 7 روز
    const token = jwt.sign(
      { userId: user._id, phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // یا از process.env.JWT_EXPIRES_IN استفاده کن
    );

    // حذف OTP پس از استفاده
    await Otp.deleteMany({ phoneNumber });

    return res.status(200).json({
      message: 'ورود موفق ✅',
      token,
    });

  } catch (error) {
    console.error('❌ خطا در verifyOtp:', error);
    return res.status(500).json({ message: 'خطای داخلی سرور.' });
  }
};

module.exports = verifyOtp;
