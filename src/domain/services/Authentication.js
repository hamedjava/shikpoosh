// src/domain/services/Authentication.js
const jwt = require("jsonwebtoken");
const User = require("../entities/user");

class Authentication {
    constructor(userRepository) {
        this.userRepository = userRepository;  // فرض می‌کنیم که یک repository برای مدیریت کاربران داریم
    }

    async register(email, password) {
        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) {
            throw new Error("این ایمیل قبلاً ثبت‌نام شده است");
        }

        const newUser = new User(null, email, password); // برای سادگی از null برای ID استفاده کردیم
        await this.userRepository.save(newUser);
        return newUser;
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("کاربر پیدا نشد");
        }

        if (!user.validatePassword(password)) {
            throw new Error("رمز عبور اشتباه است");
        }

        // ساخت توکن JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    }

    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new Error("توکن نامعتبر یا منقضی شده است");
        }
    }
}

module.exports = Authentication;
