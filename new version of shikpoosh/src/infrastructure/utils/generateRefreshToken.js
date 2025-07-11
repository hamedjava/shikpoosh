// const jwt = require('jsonwebtoken');

// const generateRefreshToken = (userId, role) => {
//   return jwt.sign(
//     { id: userId, role },
//     process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
//     { expiresIn: '7d' }
//   );
// };

// module.exports = generateRefreshToken;


const jwt = require('jsonwebtoken');

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET || 'refreshsecret',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );
};

module.exports = generateRefreshToken;
