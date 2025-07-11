// src/domain/use-cases/auth/logoutUser.js
const User = require('../../../infrastructure/database/models/User');

const logoutUser = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('کاربر یافت نشد.');

  // حذف توکن موردنظر از آرایه
  user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
  await user.save();
};

module.exports = logoutUser;
