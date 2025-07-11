const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../src/frameworks/express/middlewares/authMiddleware');

router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({
        message: 'دسترسی با موفقیت انجام شد 🎉',
        user: req.user
    });
});

// مسیر محافظت‌ شده
router.get('/api/auth/profile', authMiddleware, (req, res) => {
    res.status(200).json({
      message: 'دسترسی مجاز ✅',
      user: req.user // اطلاعات از داخل توکن
    });
  });


module.exports = router;