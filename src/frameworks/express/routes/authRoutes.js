const express = require('express');
const { register, login,requestOtp,verifyOtp} = require('../controllers/authController');
const protected = require('../../../frameworks/express/routes/protectedRoutes');
const {loginController,refreshController,logoutController,logoutAllController} = require('../../../../src/interface/http/auth.controller');
const router = express.Router();

router.post('/register', register);
router.post('/login',login);
router.get('/protected',protected);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp); // ⬅️ فقط /verify-otp
router.post('/login_controller', loginController); // فرض بر احراز OTP
router.post('/refresh-token', refreshController);
router.post('/logout', logoutController);
router.post('/logout-all', logoutAllController);

module.exports = router;
