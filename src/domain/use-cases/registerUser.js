const UserRepository = require('../../data/repositories/userRepository');

class RegisterUser {
    async execute(userData) {
        const existingUser = await UserRepository.getUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('این ایمیل قبلاً ثبت شده است');
        }

        return await UserRepository.createUser(userData);
    }
}

module.exports = new RegisterUser();
