const User = require('../../../infrastructure/database/models/User');

const logoutAllDevices = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('کاربر یافت نشد.');

  user.refreshTokens = [];           // پاک‌کردن تمام RefreshTokenها
  await user.save();
};

module.exports = logoutAllDevices;
