// src/frameworks/express/controllers/authController.js
const Authentication = require("../../../domain/services/Authentication");
const UserRepository = require("../../../domain/entities/user");

const userRepository = new UserRepository();
const authService = new Authentication(userRepository);

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.register(email, password);
        res.status(201).json({
            success: true,
            message: "ثبت‌ نام با موفقیت انجام شد",
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password);
        res.status(200).json({
            success: true,
            message: "ورود با موفقیت انجام شد",
            token,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { register, login };
