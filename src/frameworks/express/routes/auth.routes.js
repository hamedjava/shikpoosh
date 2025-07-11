const express = require('express');
const { loginController, refreshController, logoutController, logoutAllController } = require('../../../../src/interface/http/auth.controller');

const router = express.Router();

router.post('/login', loginController); // فرض بر احراز OTP
router.post('/refresh-token', refreshController);
router.post('/logout', logoutController);
router.post('/logout-all', logoutAllController);

module.exports = router;
