const jwt = require('jsonwebtoken');

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_SECRET);
}

module.exports = {
  generateTokens,
  verifyRefreshToken
};
