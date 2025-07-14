// src/interfaces/http/middleware/rateLimiters.js
const rateLimit = require('express-rate-limit');

// 💥 برای لاگین: حداکثر 5 بار در هر 15 دقیقه
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'تعداد دفعات ورود بیش از حد مجاز است. لطفاً بعداً تلاش کنید.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔐 برای OTP: حداکثر 3 بار در هر 10 دقیقه برای یک شماره
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {
    error: 'کد تأیید بیش از حد درخواست شده. لطفاً بعداً تلاش کنید.'
  },
  keyGenerator: (req) => req.body.phoneNumber || req.ip, // محدودیت بر اساس شماره
  standardHeaders: true,
  legacyHeaders: false,
});

// 🆕 برای ثبت‌ نام
const registerLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: {
    error: 'تلاش برای ثبت‌نام بیش از حد. لطفاً بعداً امتحان کنید.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // ۱۰ دقیقه
  max: 3,
  message: { error: 'درخواست بیش از حد برای بازیابی رمز. بعداً تلاش کنید.' },
  keyGenerator: (req) => req.body.phoneNumber || req.ip,
});



module.exports = {
  loginLimiter,
  otpLimiter,
  registerLimiter,
  resetLimiter
};
