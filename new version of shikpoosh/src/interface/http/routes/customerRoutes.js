const express = require('express');
const router = express.Router();

const {authenticate} = require('../../../interface/http/authMiddleware'); // بررسی JWT
const authorizeRole = require('../../../interface/http/authorizeRole'); // بررسی نقش

// فقط مشتری‌ها به این روت دسترسی دارند
router.get('/profile', authenticate, authorizeRole('customer'), (req, res) => {
  res.json({ message: '👤 پروفایل مشتری در دسترس است.' });
});

module.exports = router;
