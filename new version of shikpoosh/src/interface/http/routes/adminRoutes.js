const express = require('express');
const router = express.Router();

const {authenticate} = require('../../../interface/http/authMiddleware'); // بررسی JWT
const authorizeRole = require('../../../interface/http/authorizeRole'); // بررسی نقش

router.get('/dashboard', authenticate, authorizeRole('admin'), (req, res) => {
  res.json({ message: '🎉 خوش آمدید به داشبورد ادمین' });
});

module.exports = router;
