const express = require('express');
const registerUser = require('../../../use-cases/registerUser');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const user = await RegisterUser.execute(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
