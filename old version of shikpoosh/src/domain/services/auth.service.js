const { generateTokens, verifyRefreshToken } = require('../../utils/token.utils');
const userModel = require('../../infrastructure/database/models/User');

const refreshTokenStore = new Map(); // اگر بخوایم بعداً Redis بزنیم این‌جا جاشه

exports.login = async (user) => {
  const { accessToken, refreshToken } = generateTokens(user);
  refreshTokenStore.set(refreshToken, user._id.toString());
  return { accessToken, refreshToken };
};

exports.refreshToken = async (token) => {
  try {
    const payload = verifyRefreshToken(token);
    const storedUserId = refreshTokenStore.get(token);

    if (!storedUserId || storedUserId !== payload.id) {
      throw new Error('Invalid token');
    }

    const user = await userModel.findById(payload.id);
    if (!user) throw new Error('User not found');

    const { accessToken } = generateTokens(user);
    return accessToken;
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};

exports.logout = async (token) => {
  refreshTokenStore.delete(token);
};

exports.logoutAllDevices = async (userId) => {
  for (const [token, id] of refreshTokenStore.entries()) {
    if (id === userId) refreshTokenStore.delete(token);
  }
};
