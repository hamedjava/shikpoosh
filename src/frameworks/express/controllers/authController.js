const userRepository = require('../../../../src/adapter/repository/userRepository');
const registerUser = require('../../../domain/use-cases/auth/registerUser');
const loginUser = require('../../../domain/use-cases/auth/loginUser');
const sendOTP = require('../../../utils/sendSMS');


const register = async (req, res) => {
    try {
        const user = await registerUser(req.body, { userRepository });
        res.status(201).json({ message: 'ثبت‌ نام با موفقیت انجام شد', user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const login = async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const { token, user } = await loginUser(phoneNumber, password);
        return res.status(200).json({
            message: 'ورود موفقیت‌آمیز بود.',
            token,
            user
        });
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};
const requestOtp = async (req, res) => {
    try {
      const { phoneNumber } = req.body;
  
      if (!phoneNumber) {
        return res.status(400).json({ message: 'شماره موبایل الزامی است.' });
      }
  
      // ✅ تولید کد OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
      // TODO: ذخیره در Redis یا دیتابیس برای اعتبارسنجی بعدی
  
      // ✅ ارسال پیامک واقعی
      await sendOTP(phoneNumber, otpCode);
  
      // ❗️در نسخه production هرگز OTP رو در پاسخ نده
      res.status(200).json({
        message: 'کد تأیید با موفقیت ارسال شد ✅'
      });
    } catch (error) {
      console.error('❌ خطا در ارسال پیامک:', error);
      res.status(500).json({
        message: 'ارسال پیامک با خطا مواجه شد. لطفاً دوباره تلاش کنید.'
      });
    }
  };
  
  
  const verifyOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;
  
    if (!otp || !phoneNumber) {
      return res.status(400).json({ message: 'اطلاعات ناقص است.' });
    }
  
    // در نسخه واقعی: بررسی کن که OTP درست و معتبره (مثلاً از Redis)
    // فعلاً همه چیز رو قبول می‌کنیم
    res.status(200).json({ message: 'تأیید موفقیت‌آمیز بود 🎉', phoneNumber });
  };

module.exports = { register,login,requestOtp,verifyOtp };
