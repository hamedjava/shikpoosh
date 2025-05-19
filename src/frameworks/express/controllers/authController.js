const userRepository = require('../../../../src/adapter/repository/userRepository');
const registerUser = require('../../../domain/use-cases/auth/registerUser');
const loginUser = require('../../../domain/use-cases/auth/loginUser');


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
    const { phoneNumber } = req.body;
  
    if (!phoneNumber) {
      return res.status(400).json({ message: 'شماره موبایل الزامی است.' });
    }
  
    // 👇 ساخت یک کد OTP ساده و موقت
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
    // اینجا باید OTP رو ذخیره کنی یا بفرستی (مثلاً تو دیتابیس یا Redis)
    // فعلاً صرفاً لاگ می‌کنیم:
    console.log(`📩 OTP for ${phoneNumber}: ${otpCode}`);
  
    // می‌تونی اینجا توکن هم بسازی برای مرحله بعدی
    res.status(200).json({ message: 'کد تأیید ارسال شد ✅', otp: otpCode }); // OTP رو بعداً در نسخه production نفرست!
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
