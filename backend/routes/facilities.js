const express = require('express');
const router = express.Router();

// Mock facilities data (replace with database later)
const facilities = [
    {
        id: 1,
        name: "Sunshine Senior Care",
        location: "2.3 miles away",
        address: "123 Oak Street, Minneapolis, MN 55401",
        availableBeds: 3,
        totalBeds: 12,
        responseTime: "15 min",
        rating: 4.8,
        availabilityClass: 'available',
        availabilityText: 'Available',
        specialties: ["Post-Surgical", "Wound Care", "Physical Therapy", "IV Therapy"],
        insurance: ["Medicare", "Medicaid", "Private Insurance"],
        contactPhone: "(612) 555-0100",
        contactEmail: "intake@sunshinecare.com",
        successRate: 96
    },
    {
        id: 2,
        name: "Harmony Healthcare Center",
        location: "3.7 miles away",
        address: "456 Elm Avenue, St. Paul, MN 55102",
        availableBeds: 1,
        totalBeds: 20,
        responseTime: "30 min",
        rating: 4.6,
        availabilityClass: 'limited',
        availabilityText: 'Limited',
        specialties: ["Rehabilitation", "Cardiac Care", "Respiratory Care"],
        insurance: ["Medicare", "Blue Cross", "Aetna"],
        contactPhone: "(651) 555-0200",
        contactEmail: "care@harmonyhc.com",
        successRate: 92
    },
    {
        id: 3,
        name: "Willow Creek Rehabilitation",
        location: "5.1 miles away",
        address: "789 Pine Road, Bloomington, MN 55425",
        availableBeds: 8,
        totalBeds: 30,
        responseTime: "20 min",
        rating: 4.9,
        availabilityClass: 'available',
        availabilityText: 'Available',
        specialties: ["Orthopedic Rehab", "Neuro Rehab", "Speech Therapy", "Occupational Therapy"],
        insurance: ["All Major Insurance"],
        contactPhone: "(952) 555-0300",
        contactEmail: "admin@willowcreek.com",
        successRate: 98
    },
    {
        id: 4,
        name: "Cedar Grove Care Home",
        location: "6.8 miles away",
        address: "321 Maple Drive, Eden Prairie, MN 55344",
        availableBeds: 0,
        totalBeds: 15,
        responseTime: "45 min",
        rating: 4.5,
        availabilityClass: 'full',
        availabilityText: 'Full',
        specialties: ["Dementia Care", "Palliative Care", "24/7 Nursing"],
        insurance: ["Medicare", "Medicaid"],
        contactPhone: "(952) 555-0400",
        contactEmail: "info@cedargrove.com",
        successRate: 90
    },
    {
        id: 5,
        name: "Riverside Recovery Center",
        location: "8.2 miles away",
        address: "555 River Road, Minnetonka, MN 55305",
        availableBeds: 5,
        totalBeds: 25,
        responseTime: "25 min",
        rating: 4.7,
        availabilityClass: 'available',
        availabilityText: 'Available',
        specialties: ["Stroke Recovery", "Physical Therapy", "Occupational Therapy"],
        insurance: ["Medicare", "Private Insurance", "Aetna"],
        contactPhone: "(952) 555-0500",
        contactEmail: "referrals@riverside.com",
        successRate: 94
    }
];

// GET all facilities
router.get('/', (req, res) => {
    try {
        // Apply filters if provided
        let filteredFacilities = [...facilities];
        
        const { careType, availability, insurance, distance } = req.query;
        
        if (careType && careType !== 'All Types') {
            filteredFacilities = filteredFacilities.filter(f => 
                f.specialties.some(s => s.toLowerCase().includes(careType.toLowerCase()))
            );
        }
        
        if (availability === 'Available Now') {
            filteredFacilities = filteredFacilities.filter(f => f.availableBeds > 0);
        }
        
        if (insurance && insurance !== 'All Insurance') {
            filteredFacilities = filteredFacilities.filter(f => 
                f.insurance.some(i => i.toLowerCase().includes(insurance.toLowerCase()))
            );
        }
        
        res.json(filteredFacilities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch facilities' });
    }
});

// GET single facility by ID
router.get('/:id', (req, res) => {
    const facility = facilities.find(f => f.id == req.params.id);
    if (facility) {
        res.json(facility);
    } else {
        res.status(404).json({ error: 'Facility not found' });
    }
});

// UPDATE facility availability
router.patch('/:id/availability', (req, res) => {
    const facility = facilities.find(f => f.id == req.params.id);
    if (facility) {
        facility.availableBeds = req.body.availableBeds;
        facility.availabilityClass = facility.availableBeds > 3 ? 'available' : 
                                     facility.availableBeds > 0 ? 'limited' : 'full';
        facility.availabilityText = facility.availableBeds > 3 ? 'Available' : 
                                    facility.availableBeds > 0 ? 'Limited' : 'Full';
        res.json(facility);
    } else {
        res.status(404).json({ error: 'Facility not found' });
    }
});

module.exports = router;
