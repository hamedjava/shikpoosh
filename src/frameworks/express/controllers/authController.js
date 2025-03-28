// src/frameworks/express/controllers/authController.js
const User = require('../../../domain/entities/user');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'لطفاً ایمیل و پسورد را وارد کنید.' });
    }

    try {
        const user = await User.createUser(email, password);

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'ثبت‌نام با موفقیت انجام شد.',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'لطفاً ایمیل و پسورد را وارد کنید.' });
    }

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'کاربری با این ایمیل یافت نشد.' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'پسورد اشتباه است.' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'ورود با موفقیت انجام شد.',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'خطا در ورود.' });
    }
};

module.exports = { register, login };
