// const express = require('express');
// const { register, login,requestOtp,verifyOtp} = require('../../../frameworks/express/controllers/authController');
// const protected = require('../../../frameworks/express/routes/protectedRoutes');
// const authenticate = require('../middlewares/authMiddleware'); // اگه داری

// const router = express.Router();

// router.post('/register', register);
// router.post('/login',login);
// router.get('/protected',protected);
// router.post('/request-otp', requestOtp);
// router.post('/verify-otp', verifyOtp); // ⬅️ فقط /verify-otp

// ////////////////////////////for logout and logoutAllDevices///////////////////////////////////
// router.post('/logout', authenticate, authController.logout);
// router.post('/logout-all', authenticate, authController.logoutAll);
// router.post('/refresh-token', authController.refreshAccessToken);
// ////////////////////////////for logout and logoutAllDevices///////////////////////////////////
// module.exports = router;
const express = require('express');
const router = express.Router();

const {
  register,
  login,
  requestOtp,
  verifyOtp,
  logout,
  logoutAll,
  refreshToken
} = require('../../../frameworks/express/controllers/authController');

const protected = require('../../../frameworks/express/routes/protectedRoutes');
const { authenticate } = require('../../../../src/interface/http/authMiddleware');
const authController = require('../../../frameworks/express/controllers/authController');
const { loginLimiter, otpLimiter, registerLimiter } = require('../../../../src/interface/http/rateLimiters');

// 👇 مسیرهای Auth
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/request-otp', otpLimiter, requestOtp);
router.post('/verify-otp', verifyOtp);
//=============================================================
// 👇 مسیرهای محافظت‌شده
router.get('/protected', protected);
//=============================================================
// 👇 مسیرهای logout و refresh
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, logoutAll);
router.post('/refresh-token', refreshToken);   // نیازی به authMiddleware ندارد

//==============================================================
module.exports = router;
