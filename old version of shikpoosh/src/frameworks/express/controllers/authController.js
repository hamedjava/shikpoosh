const userRepository = require('../../../../src/adapter/repository/userRepository');
const registerUser = require('../../../domain/use-cases/auth/registerUser');
const loginUser = require('../../../domain/use-cases/auth/loginUser');
const sendOTP = require('../../../utils/sendSMS');
const jwt = require('jsonwebtoken');
const Otp = require('../../../../src/infrastructure/database/models/otpModel'); // مدل otp جداگانه
const User = require('../../../infrastructure/database/models/User');


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

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 دقیقه اعتبار

  // حذف OTPهای قبلی برای این شماره
  await Otp.deleteMany({ phoneNumber });

  // ذخیره در دیتابیس
  await Otp.create({ phoneNumber, otpCode, expiresAt });

  // ارسال پیامک واقعی را اینجا قرار بده (فعلاً فقط لاگ می‌کنیم)
  console.log(`📩 OTP برای ${phoneNumber}: ${otpCode}`);

  res.status(200).json({ message: 'کد تأیید ارسال شد ✅' });
};


const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'شماره و کد تأیید الزامی هستند.' });
  }

  try {
    // پیدا کردن OTP معتبر
    const record = await Otp.findOne({ phoneNumber, otpCode: otp });

    if (!record) {
      return res.status(401).json({ message: 'کد تأیید اشتباه است یا منقضی شده.' });
    }

    // بررسی تاریخ انقضا
    if (record.expiresAt < new Date() ) {
      await Otp.deleteMany({ phoneNumber }); // پاک‌سازی رکوردهای منقضی‌شده
      return res.status(401).json({ message: 'کد تأیید منقضی شده است.' });
    }

    // تولید JWT
    const token = jwt.sign(
      { phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // حذف OTP بعد از استفاده
    await Otp.deleteMany({ phoneNumber });

    return res.status(200).json({
      message: 'ورود موفق ✅',
      token,
    });

  } catch (error) {
    console.error('❌ Error in verifyOtp:', error);
    return res.status(500).json({ message: 'خطای داخلی سرور.' });
  }
};






// const verifyOtp = async (req, res) => {
//   const { phoneNumber, otpCode } = req.body;

//   if (!phoneNumber || !otpCode) {
//     return res.status(400).json({ message: 'شماره موبایل و کد تأیید الزامی است.' });
//   }

//   const existingOtp = await Otp.findOne({ phoneNumber, otpCode });

//   if (!existingOtp) {
//     return res.status(400).json({ message: 'کد تأیید اشتباه است.' });
//   }

//   if (existingOtp.expiresAt < new Date()) {
//     await Otp.deleteOne({ _id: existingOtp._id });
//     return res.status(400).json({ message: 'کد تأیید منقضی شده است.' });
//   }

//   let user = await User.findOne({ phoneNumber });

//   if (!user) {
//     // ثبت‌نام سریع کاربر
//     user = await User.create({
//       phoneNumber,
//       name: 'کاربر جدید',
//       email: `${phoneNumber}@example.com`,
//       password: 'default', // به دلیل فیلد required، مقدار دیفالت
//     });
//   }

//   // حذف OTP پس از استفاده
//   await Otp.deleteOne({ _id: existingOtp._id });

//   // پاسخ نهایی (میتونی JWT بدی اینجا)
//   res.status(200).json({
//     message: 'ورود با موفقیت انجام شد 🎉',
//     user: {
//       _id: user._id,
//       name: user.name,
//       phoneNumber: user.phoneNumber,
//       email: user.email,
//       role: user.role,
//     },
//   });
// };

module.exports = { register, login, requestOtp, verifyOtp };






// const requestOtp = async (req, res) => {
//   try {
//     const { phoneNumber } = req.body;

//     if (!phoneNumber) {
//       return res.status(400).json({ message: 'شماره موبایل الزامی است.' });
//     }

//     // ✅ تولید کد OTP
//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//     // TODO: ذخیره در Redis یا دیتابیس برای اعتبارسنجی بعدی

//     // ✅ ارسال پیامک واقعی
//     await sendOTP(phoneNumber, otpCode);

//     // ❗️در نسخه production هرگز OTP رو در پاسخ نده
//     res.status(200).json({
//       message: 'کد تأیید با موفقیت ارسال شد ✅'
//     });
//   } catch (error) {
//     console.error('❌ خطا در ارسال پیامک:', error);
//     res.status(500).json({
//       message: 'ارسال پیامک با خطا مواجه شد. لطفاً دوباره تلاش کنید.'
//     });
//   }
// };



////////////////////////////////////////////////////////////////////////////////////////////

// const verifyOtp = async (req, res) => {
//   const { phoneNumber, otp } = req.body;

//   if (!phoneNumber || !otp) {
//     return res.status(400).json({ message: 'شماره موبایل و کد تایید الزامی است.' });
//   }

//   // OTP رو پیدا کن
//   const otpRecord = await Otp.findOne({ phoneNumber, otp });

//   if (!otpRecord) {
//     return res.status(400).json({ message: 'کد تأیید اشتباه است یا منقضی شده.' });
//   }

//   // بررسی انقضا
//   if (otpRecord.expiresAt < Date.now()) {
//     return res.status(400).json({ message: 'کد تأیید منقضی شده است.' });
//   }

//   // کاربر رو بررسی کن
//   let user = await User.findOne({ phoneNumber });

//   // اگر کاربر وجود نداشت، ایجاد کن
//   if (!user) {
//     user = await User.create({
//       name: 'کاربر جدید',
//       phoneNumber,
//       email: `${phoneNumber}@example.com`, // یک ایمیل ساختگی موقت
//       password: 'TempPassword123!', // پسورد تصادفی برای پر شدن فیلد
//     });
//   }

//   // JWT بساز
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });

//   // حذف OTP بعد از استفاده (امن‌تر)
//   await Otp.deleteOne({ _id: otpRecord._id });

//   res.status(200).json({
//     message: 'ورود با موفقیت انجام شد 🎉',
//     token,
//     user,
//   });
// };


// const verifyOtp = async (req, res) => {
//   const { phoneNumber, otp } = req.body;

//   if (!otp || !phoneNumber) {
//     return res.status(400).json({ message: 'اطلاعات ناقص است.' });
//   }

//   // در نسخه واقعی: بررسی کن که OTP درست و معتبره (مثلاً از Redis)
//   // فعلاً همه چیز رو قبول می‌کنیم
//   res.status(200).json({ message: 'تأیید موفقیت‌آمیز بود 🎉', phoneNumber });
// };
