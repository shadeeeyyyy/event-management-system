const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const generateToken = require('../utils/generateToken'); // Import JWT generator

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return; // Stop execution
    }

    try {
        // Create new user (password will be hashed by pre-save middleware in User model)
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({ // 201 means 'Created'
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id), // Generate JWT and send it
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) { // Use the custom matchPassword method
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id), // Generate JWT and send it
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' }); // 401 means 'Unauthorized'
    }
});

module.exports = router;