const jwt = require('jsonwebtoken');
const User = require('../../../infrastructure/database/models/User');
const generateAccessToken = require('../../../infrastructure/utils/generateToken');

const refreshAccessToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshkey');
  const user = await User.findById(decoded.id);
  if (!user) throw new Error('کاربر یافت نشد.');

  const isValid = user.refreshTokens.includes(refreshToken);
  if (!isValid) throw new Error('توکن معتبر نیست.');

  const newAccessToken = generateAccessToken(user._id, user.role);
  return {
    token: newAccessToken,
    user: {
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
    }
  };
};

module.exports = refreshAccessToken;
