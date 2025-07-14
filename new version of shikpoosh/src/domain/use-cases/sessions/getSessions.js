const User = require('../../../infrastructure/database/models/User');

const getSessions = async (userId) => {
  const user = await User.findById(userId).select('refreshTokens');

  if (!user || !user.refreshTokens) {
    return [];
  }

  return user.refreshTokens.map((session) => ({
    userAgent: session.userAgent,
    ip: session.ip,
    createdAt: session.createdAt,
  }));
};

module.exports = getSessions;
