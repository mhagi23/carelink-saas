const express = require('express');
const router = express.Router();

// GET /api/transfers
router.get('/', async (req, res) => {
    try {
        res.json({ message: 'Transfers endpoint - coming soon' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 