const userRepository = require('../../../../src/adapter/repository/userRepository');
const registerUser = require('../../../domain/use-cases/auth/registerUser');
const loginUser = require('../../../domain/use-cases/auth/loginUser');
const sendOTP = require('../../../utils/sendSMS');
const jwt = require('jsonwebtoken');
const Otp = require('../../../../src/infrastructure/database/models/otpModel'); // مدل otp جداگانه
const User = require('../../../infrastructure/database/models/User');

//===============================reset pasword imports=============================
const requestResetPassword = require('../../../domain/use-cases/resetPassword/requestResetPassword');
const resetPassword = require('../../../domain/use-cases/resetPassword/resetPassword');
//===============================reset pasword imports=============================

//========== sessions imports ===========
const getSessions = require('../../../domain/use-cases/sessions/getSessions');
const deleteSession = require('../../../domain/use-cases/sessions/deleteSession');
//========== sessions imports ===========


/////////////////////////////for logout///////////////////////////////////////
const logoutAllDevices = require('../.../../../../domain/use-cases/auth/logoutAllDevices');
const refreshAccessToken = require('../../../../src/domain/use-cases/auth/refreshToken');
const logoutUser = require('../../../../src/domain/use-cases/auth/logoutUser');
const logoutOtherDevicesUC = require('../../../domain/use-cases/auth/logoutOtherDevices');
//////////////////////////////for logout////////////////////////////////////////////

//=============================login and register method================================
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
    // const result = await loginUser(phoneNumber, password);
    const result = await loginUser(phoneNumber, password, req); // 👈 req اضافه شده

    // 👇 ذخیره refreshToken در کوکی
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 روز
    });

    // 👇 پاسخ نهایی
    res.status(200).json({
      message: 'ورود موفقیت‌آمیز بود.',
      token: result.token,
      user: result.user
    });

  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
//=============================login and register method================================



// const login = async (req, res) => {
//   const { phoneNumber, password } = req.body;

//   try {
//     const { phoneNumber, password } = req.body;

//     const result = await loginUser(phoneNumber, password);

//     res.status(200).json({
//       message: 'ورود موفقیت‌آمیز بود.',
//       token: result.token,
//       refreshToken: result.refreshToken, // ✅ اضافه کن
//       user: result.user
//     });
//   } catch (err) {
//     res.status(401).json({ error: err.message });
//   }
// };

//=====================================Request otp and verify otp methods===========================
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
    if (record.expiresAt < new Date()) {
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
//=====================================Request otp and verify otp methods===========================


//////////////////////////////////////for logout and logoutAllDevices///////////////////////////////////////////
// خروج از یک دستگاه
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // از کوکی گرفته میشه

  if (!refreshToken) {
    return res.status(401).json({ error: 'رفرش‌توکن یافت نشد.' });
  }

  try {
    await logoutUser(req.user._id, refreshToken);

    res.clearCookie('refreshToken'); // حذف کوکی
    return res.status(200).json({ message: 'با موفقیت خارج شدید.' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};


// خروج از همه دستگاه‌ها
const logoutAll = async (req, res) => {
  try {
    await logoutAllDevices(req.user._id);

    // کوکی refreshToken فعلی را هم حذف کن
    res.clearCookie('refreshToken');

    res.status(200).json({ message: 'از همه دستگاه‌ها خارج شدید.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// صدور توکن جدید
const refreshToken = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    return res.status(401).json({ error: 'رفرش‌ توکن یافت نشد.' });
  }

  try {
    const result = await refreshAccessToken(oldRefreshToken);

    // ست‌کردن کوکی جدید (اختیاری ولی توصیه می‌شود)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      token: result.token,
      user: result.user
    });
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
};

////////////////////////////////for logout and logoutAllDevices//////////////////////////////////////////

//============================reset password methods=================================
// ارسال OTP
const forgotPassword = async (req, res) => {
  try {
    await requestResetPassword(req.body.phoneNumber);
    res.status(200).json({ message: 'کد بازیابی ارسال شد.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// تأیید OTP و تغییر رمز
const confirmResetPassword = async (req, res) => {
  try {
    await resetPassword(req.body); // { phoneNumber, otpCode, newPassword }
    res.status(200).json({ message: 'رمز عبور با موفقیت تغییر کرد.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
//============================reset password methods=================================


//======================================get Sessions==========================================
const listSessions = async (req, res) => {
  try {
    const sessions = await getSessions(req.user._id);
    res.status(200).json({ sessions });
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت لیست جلسات.' });
  }
};
//======================================get Sessions==========================================

//==============================DELETE A SESSION============================
const removeSession = async (req, res) => {
  const { token } = req.params;

  try {
    await deleteSession(req.user._id, token);
    res.status(200).json({ message: 'سشن با موفقیت حذف شد ✅' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
//==============================DELETE A SESSION============================



//===========================logout other devices==========================

// خروج از تمام دستگاه‌ها به جز دستگاه فعلی
const logoutOtherDevices = async (req, res) => {
  try {
    await logoutOtherDevicesUC(req.user._id, req.token);
    res.status(200).json({ message: 'از تمام دستگاه‌ها (به‌جز این) خارج شدید ✅' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
//===========================logout other devices==========================


//============================get User Sessions===========================
// نمایش نشست‌های فعال کاربر
const getUserSessions = async (req, res) => {
  try {
    const user = req.user;

    const sessions = (user.refreshTokens || []).map(session => ({
      userAgent: session.userAgent,
      ip: session.ip,
      createdAt: session.createdAt,
      token: session.token
    }));

    res.status(200).json({ sessions });
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت نشست‌ها' });
  }
};
//============================get User Sessions===========================




//==========================delete same session=========================
const deleteSameSession = async (req, res) => {
  const { token } = req.params;
  const user = req.user;

  try {
    // فیلتر کردن سشن‌هایی که برابر با توکن حذف‌ شونده نیستند
    const originalLength = user.refreshTokens.length;
    user.refreshTokens = user.refreshTokens.filter(session => session.token !== token);

    if (user.refreshTokens.length === originalLength) {
      return res.status(404).json({ error: 'نشست موردنظر یافت نشد.' });
    }

    await user.save();
    res.status(200).json({ message: 'نشست با موفقیت حذف شد.' });
  } catch (err) {
    res.status(500).json({ error: 'خطا در حذف نشست.' });
  }
};

//==========================delete same session=========================




// ✅ خروجی توابع
module.exports = {
  register,
  login,
  requestOtp,
  verifyOtp,
  logout,
  logoutAll,
  refreshToken,
  forgotPassword,
  confirmResetPassword, // 👈 حواست باشه اینو export کنی
  listSessions,
  removeSession,
  logoutOtherDevices,
  getUserSessions,
  deleteSameSession,
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
