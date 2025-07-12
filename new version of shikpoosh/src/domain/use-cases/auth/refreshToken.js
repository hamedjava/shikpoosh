// const jwt = require('jsonwebtoken');
// const User = require('../../../infrastructure/database/models/User');
// const generateAccessToken = require('../../../infrastructure/utils/generateToken');

// const refreshAccessToken = async (refreshToken) => {
//   const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshkey');
//   const user = await User.findById(decoded.id);
//   if (!user) throw new Error('کاربر یافت نشد.');

//   const isValid = user.refreshTokens.includes(refreshToken);
//   if (!isValid) throw new Error('توکن معتبر نیست.');

//   const newAccessToken = generateAccessToken(user._id, user.role);
//   return {
//     token: newAccessToken,
//     user: {
//       _id: user._id,
//       name: user.name,
//       phoneNumber: user.phoneNumber,
//       email: user.email,
//       role: user.role,
//     }
//   };
// };

// module.exports = refreshAccessToken;


// const jwt = require('jsonwebtoken');
// const User = require('../../../infrastructure/database/models/User');
// const generateToken = require('../../../infrastructure/utils/generateToken');
// const generateRefreshToken = require('../../../infrastructure/utils/generateRefreshToken');

// const refreshAccessToken = async (oldRefreshToken) => {
//   console.log('🍪 ۱) Token from cookie =>', oldRefreshToken);
//   console.log('🔑 ۲) JWT_REFRESH_SECRET =>', process.env.JWT_REFRESH_SECRET);
//   if (!oldRefreshToken) throw new Error('رفرش‌ توکن ارسال نشده است.');

//   let decoded;
//   try {
//     // decoded = jwt.verify(
//     //   oldRefreshToken,
//     //   process.env.JWT_REFRESH_SECRET || 'refreshkey'
//     // );
//     const decoded = jwt.verify(
//       oldRefreshToken,
//       process.env.JWT_REFRESH_SECRET || 'refreshkey_super_secret'
//     );
//     console.log('🪪 ۳) decoded =>', decoded);
//   } catch {
//     console.log('❌ verify error =>', err.message);
//     throw new Error('رفرش‌ توکن نامعتبر یا منقضی شده است.');
//   }

//   const user = await User.findById(decoded.id);
//   console.log('👤 ۴) user.refreshTokens =>', user && user.refreshTokens);
//   if (!user) throw new Error('کاربر یافت نشد.');

//   // توکن باید داخل آرایه وجود داشته باشد
//   const isValid = user.refreshTokens.includes(oldRefreshToken);
//   if (!isValid) throw new Error('توکن معتبر نیست یا قبلاً بلاک شده است.');

//   // 🔄 تولید AccessToken و RefreshToken جدید
//   const newAccessToken = generateToken(user._id, user.role);
//   const newRefreshToken = generateRefreshToken(user._id);

//   // جایگزینی در دیتابیس
//   user.refreshTokens = user.refreshTokens.filter(t => t !== oldRefreshToken);
//   user.refreshTokens.push(newRefreshToken);
//   await user.save();

//   return {
//     token: newAccessToken,
//     refreshToken: newRefreshToken,
//     user: {
//       _id: user._id,
//       name: user.name,
//       phoneNumber: user.phoneNumber,
//       email: user.email,
//       role: user.role
//     }
//   };
// };

// module.exports = refreshAccessToken;

const jwt = require('jsonwebtoken');
const User = require('../../../infrastructure/database/models/User');
const generateToken = require('../../../infrastructure/utils/generateToken');
const generateRefreshToken = require('../../../infrastructure/utils/generateRefreshToken');

const refreshAccessToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw new Error('رفرش‌توکن ارسال نشده است.');
  }

  let decoded;
  try {
    decoded = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET || 'refreshkey_super_secret'
    );
  } catch (err) {
    console.log('❌ verify error =>', err.message);
    throw new Error('رفرش‌ توکن نامعتبر یا منقضی شده است.');
  }

  console.log('🪪 decoded =>', decoded); // حتماً باید شیء داشته باشد

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error('کاربر یافت نشد.');
  }

  console.log('👤 user.refreshTokens =>', user.refreshTokens);

  const inDb = user.refreshTokens.includes(oldRefreshToken);
  if (!inDb) {
    throw new Error('توکن معتبر نیست یا قبلاً بلاک شده است.');
  }

  // صدور توکن‌های تازه
  const newAccessToken  = generateToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshTokens = user.refreshTokens.filter(t => t !== oldRefreshToken);
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = refreshAccessToken;

