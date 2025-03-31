const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// مسیر ثبت‌نام با اعتبارسنجی
router.post(
  '/register',
  [
    // اعتبارسنجی شماره تلفن
    check('phoneNumber', 'شماره تلفن معتبر نیست').isMobilePhone(),
    // اعتبارسنجی رمز عبور
    check('password', 'رمز عبور باید حداقل 6 کاراکتر باشد').isLength({ min: 6 })
  ],
  authController.register
);

// مسیر ورود
router.post(
  '/login',
  [
    // اعتبارسنجی شماره تلفن
    check('phoneNumber', 'شماره تلفن معتبر نیست').isMobilePhone(),
    // اعتبارسنجی رمز عبور
    check('password', 'رمز عبور الزامی است').exists()
  ],
  authController.login
);

module.exports = router;
