const express = require('express');
const registerUser = require('../../../domain/use-cases/registerUser');
const UserRepository = require('../../../data/repositories/userRepository'); // مسیر را بررسی کن

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const userData = req.body; 
        const newUser = await registerUser.execute(userData); // اینجا RegisterUser اشتباه نوشته شده بود
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await UserRepository.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'کاربر یافت نشد' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
