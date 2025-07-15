// src/domain/use-cases/auth/logoutOtherDevices.js
const User = require('../../../infrastructure/database/models/User');

/**
 * همهٔ سشن‌ها (refreshTokens) را به جز سشنِ فعلی حذف می‌کند.
 * @param {String} userId  شناسهٔ کاربر
 * @param {String} currentToken  توکن فعلی دستگاه   
 */
const logoutOtherDevices = async (userId, currentToken) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('کاربر یافت نشد.');

  // فیلتر: فقط توکن فعلی باقی بماند
  const before = user.refreshTokens.length;
  user.refreshTokens = user.refreshTokens.filter(
    (session) => session.token === currentToken
  );

  if (before === user.refreshTokens.length) {
    // یعنی اصلاً توکن فعلی در دیتابیس نبود
    throw new Error('سشن فعلی یافت نشد.');
  }

  await user.save();
  return true;
};

module.exports = logoutOtherDevices;
