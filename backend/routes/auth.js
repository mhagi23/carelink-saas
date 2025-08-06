const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock users (in production, use database)
const users = [
    {
        id: 1,
        email: "demo@hospital.com",
        password: "$2a$10$YourHashedPasswordHere", // Password: demo123
        hospitalName: "St. Mary's Hospital",
        role: "staff"
    }
];

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // For demo purposes, allow any login
        const token = jwt.sign(
            { id: 1, email: email },
            process.env.JWT_SECRET || 'demo_secret_key',
            { expiresIn: '7d' }
        );
        
        res.json({
            token,
            user: {
                id: 1,
                email: email,
                hospitalName: "St. Mary's Hospital"
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password, hospitalName } = req.body;
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user (in production, save to database)
        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            hospitalName,
            role: 'staff'
        };
        
        users.push(newUser);
        
        // Create token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET || 'demo_secret_key',
            { expiresIn: '7d' }
        );
        
        res.json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                hospitalName: newUser.hospitalName
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

module.exports = router;
