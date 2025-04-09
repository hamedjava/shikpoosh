const userModel = require('../../../../infrastructure/database/models/userModel');  // مدل Mongoose
const bcrypt = require('bcryptjs');  // برای هش کردن پسورد
const jwt = require('jsonwebtoken');

// ثبت‌نام
const register = async (req, res) => {
    const { name, phoneNumber, email, password } = req.body;  // اضافه کردن email به داده‌ها

    // بررسی اینکه آیا تمامی فیلدها پر شده‌اند
    if (!name || !phoneNumber || !email || !password) {
        return res.status(400).json({ message: 'همه فیلدها الزامی هستند.' });
    }

    try {
        // بررسی اینکه آیا کاربری با شماره تلفن یا ایمیل موجود است
        const existingUser = await userModel.findOne({ $or: [{ phoneNumber }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'این شماره تلفن یا ایمیل قبلاً ثبت شده است.' });
        }

        // ساخت کاربر جدید
        const newUser = new userModel({
            name,
            phoneNumber,
            email,
            password,
        });

        // هش کردن پسورد قبل از ذخیره
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        // ذخیره کاربر جدید در دیتابیس
        await newUser.save();

        // ساخت توکن برای کاربر
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'ثبت‌نام موفقیت‌آمیز بود.', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ورود
const login = async (req, res) => {
    const { phoneNumber, password } = req.body;

    // بررسی اینکه آیا شماره تلفن و پسورد ارسال شده‌اند
    if (!phoneNumber || !password) {
        return res.status(400).json({ message: 'شماره تلفن و پسورد الزامی هستند.' });
    }

    try {
        // جستجو برای کاربر با شماره تلفن
        const user = await userModel.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({ message: 'کاربری با این شماره تلفن پیدا نشد.' });
        }

        // تطابق پسورد وارد شده با پسورد ذخیره شده
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'پسورد اشتباه است.' });
        }

        // ساخت توکن برای کاربر
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'ورود موفقیت‌آمیز بود.', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login };
