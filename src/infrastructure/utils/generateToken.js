const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secretkey',
        { expiresIn: '1d' }
    );
};

module.exports = generateToken;
