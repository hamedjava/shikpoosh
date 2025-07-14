const User = require('../../../infrastructure/database/models/User');

const deleteSession = async (userId, targetToken) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('کاربر یافت نشد');

  const beforeCount = user.refreshTokens?.length || 0;

  user.refreshTokens = user.refreshTokens.filter((session) => session.token !== targetToken);

  if (user.refreshTokens.length === beforeCount) {
    throw new Error('نشست مورد نظر یافت نشد.');
  }

  await user.save();
  return true;
};

module.exports = deleteSession;
