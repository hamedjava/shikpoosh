const express = require('express');
const router = express.Router();

const {authenticate} = require('../../../interface/http/authMiddleware'); // بررسی JWT
const authorizeRole = require('../../../interface/http/authorizeRole'); // بررسی نقش

// فقط فروشنده‌ها به این روت دسترسی دارند
router.get('/dashboard', authenticate, authorizeRole('seller'), (req, res) => {
  res.json({ message: '🛍️ داشبورد فروشنده قابل مشاهده است.' });
});

module.exports = router;
