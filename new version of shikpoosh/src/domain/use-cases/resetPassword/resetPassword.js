const bcrypt           = require('bcrypt');
const PasswordResetOTP = require('../../../infrastructure/database/models/PasswordResetOTP');
const User             = require('../../../infrastructure/database/models/User');

module.exports = async ({ phoneNumber, otpCode, newPassword }) => {
  if (!phoneNumber || !otpCode || !newPassword) {
    throw new Error('اطلاعات ناقص است.');
  }

  const record = await PasswordResetOTP.findOne({ phoneNumber, otpCode });
  if (!record) throw new Error('کد تأیید اشتباه است.');
  if (record.expiresAt < Date.now()) {
    await PasswordResetOTP.deleteMany({ phoneNumber });
    throw new Error('کد تأیید منقضی شده است.');
  }

  const user = await User.findOne({ phoneNumber });
  if (!user) throw new Error('کاربر یافت نشد.');

  // هش رمز جدید
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  // پاک‌سازی OTP
  await PasswordResetOTP.deleteMany({ phoneNumber });
  return true;
};
