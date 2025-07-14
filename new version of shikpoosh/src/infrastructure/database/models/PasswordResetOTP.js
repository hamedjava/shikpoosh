// src/infrastructure/database/models/PasswordResetOTP.js
const mongoose = require('mongoose');

const resetOtpSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  otpCode    : { type: String, required: true },
  expiresAt  : { type: Date,   required: true },
});

module.exports = mongoose.model('PasswordResetOTP', resetOtpSchema);
