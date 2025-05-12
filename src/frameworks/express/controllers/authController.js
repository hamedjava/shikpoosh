const userRepository = require('../../../../src/adapter/repository/userRepository');
const registerUser = require('../../../domain/use-cases/auth/registerUser');
const loginUser = require('../../../domain/use-cases/auth/loginUser');


const register = async (req, res) => {
    try {
        const user = await registerUser(req.body, { userRepository });
        res.status(201).json({ message: 'ثبت‌ نام با موفقیت انجام شد', user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const login = async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const { token, user } = await loginUser(phoneNumber, password);
        return res.status(200).json({
            message: 'ورود موفقیت‌آمیز بود.',
            token,
            user
        });
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};


module.exports = { register,login };
