const express = require('express');
const { register, login } = require('../controllers/authController');
const protected = require('../../../frameworks/express/routes/protectedRoutes');
const router = express.Router();
router.post('/register', register);
router.post('/login',login);
router.get('/protected',protected);
module.exports = router;
