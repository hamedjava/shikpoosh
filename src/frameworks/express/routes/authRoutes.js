const express = require('express');
const { register, login,requestOtp,verifyOtp} = require('../controllers/authController');
const protected = require('../../../frameworks/express/routes/protectedRoutes');
const router = express.Router();

router.post('/register', register);
router.post('/login',login);
router.get('/protected',protected);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp); // ⬅️ فقط /verify-otp


module.exports = router;
