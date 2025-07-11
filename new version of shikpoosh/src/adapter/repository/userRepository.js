const UserModel = require('../../infrastructure/database/models/User');

const userRepository = {
    findByPhoneOrEmail: async (phoneNumber, email) => {
        return await UserModel.findOne({
            $or: [{ phoneNumber }, { email }]
        });
    },

    create: async (userEntity) => {
        const newUser = new UserModel(userEntity);
        return await newUser.save();
    }
};

module.exports = userRepository;
