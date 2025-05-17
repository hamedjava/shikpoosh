const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../interface/http/authMiddleware');

router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({
        message: 'دسترسی با موفقیت انجام شد 🎉',
        user: req.user
    });
});

module.exports = router;
