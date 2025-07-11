// src/infrastructure/database/models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  // سایر فیلدها مثل roles یا OTP یا deviceToken و ...
});

const User = mongoose.model('User', userSchema);
module.exports = User;
