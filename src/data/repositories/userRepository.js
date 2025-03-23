const db = require('../../frameworks/database/mongo'); // اتصال به دیتابیس

const UserModel = require("../../domain/entities/user");

class UserRepository {
    async createUser(user) {
        const newUser = new UserModel(user);
        return await newUser.save();
    }

    async getUserById(id) {
        return await UserModel.findById(id);
    }

    async getAllUsers() {
        return await UserModel.find();
    }

    async updateUser(id, updatedData) {
        return await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
    }

    async deleteUser(id) {
        return await UserModel.findByIdAndDelete(id);
    }
}

module.exports = new UserRepository();

