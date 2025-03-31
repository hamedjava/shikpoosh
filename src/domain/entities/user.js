// src/entities/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    static async createUser(email, password) {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error('این ایمیل قبلاً ثبت‌نام شده است.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new UserModel({ email, password: hashedPassword });
        await newUser.save();
        return newUser;
    }

    static async findByEmail(email) {
        return UserModel.findOne({ email });
    }

    async matchPassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    }
}

// ایجاد مدل برای استفاده در Mongoose
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// ثبت متدهای کلاس در مدل
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = User;
