const PasswordResetOTP = require('../../../infrastructure/database/models/PasswordResetOTP');

module.exports = async (phoneNumber) => {
  if (!phoneNumber) throw new Error('شماره الزامی است.');

  const otpCode   = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // ۵ دقیقه

  // پاک‌کردن OTPهای قبلی
  await PasswordResetOTP.deleteMany({ phoneNumber });

  // ذخیره OTP
  await PasswordResetOTP.create({ phoneNumber, otpCode, expiresAt });

  // TODO: ارسال SMS واقعی
  console.log(`🔑 OTP reset برای ${phoneNumber}: ${otpCode}`);

  return true;
};
