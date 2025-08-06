const express = require('express');
const router = express.Router();
const Facility = require('../models/Facility');
const auth = require('../middleware/auth');

// Get all facilities with filters
router.get('/', auth, async (req, res) => {
    try {
        const {
            careType,
            distance,
            insurance,
            availability
        } = req.query;

        let query = { active: true };

        // Apply filters
        if (careType && careType !== 'All') {
            query.specialties = careType;
        }

        if (insurance && insurance !== 'All') {
            query.insuranceAccepted = insurance;
        }

        if (availability === 'available') {
            query['capacity.availableBeds'] = { $gt: 0 };
        }

        const facilities = await Facility.find(query)
            .sort({ rating: -1 })
            .limit(50);

        res.json(facilities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single facility
router.get('/:id', auth, async (req, res) => {
    try {
        const facility = await Facility.findById(req.params.id);
        if (!facility) {
            return res.status(404).json({ error: 'Facility not found' });
        }
        res.json(facility);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update facility availability
router.patch('/:id/availability', auth, async (req, res) => {
    try {
        const { availableBeds } = req.body;
        
        const facility = await Facility.findByIdAndUpdate(
            req.params.id,
            { 'capacity.availableBeds': availableBeds },
            { new: true }
        );

        if (!facility) {
            return res.status(404).json({ error: 'Facility not found' });
        }

        res.json(facility);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;