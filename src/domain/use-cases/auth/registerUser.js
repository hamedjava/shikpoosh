const User = require('../../../../src/infrastructure/database/models/User');

const registerUser = async (userData) => {
  const existingUser = await User.findOne({
    $or: [
      { phoneNumber: userData.phoneNumber },
      { email: userData.email }
    ]
  });

  if (existingUser) {
    throw new Error('شماره تلفن یا ایمیل قبلاً ثبت شده است.');
  }

  const newUser = new User(userData);
  await newUser.save();

  return newUser;
};

module.exports = registerUser;
