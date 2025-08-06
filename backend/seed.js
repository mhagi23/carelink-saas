const mongoose = require('mongoose');
const Facility = require('./models/Facility');
const dotenv = require('dotenv');

dotenv.config();

const seedData = [
    {
        name: "Sunshine Senior Care",
        address: {
            street: "123 Oak Street",
            city: "Minneapolis",
            state: "MN",
            zip: "55401"
        },
        contact: {
            phone: "(612) 555-0100",
            email: "info@sunshinecare.com",
            contactPerson: "Sarah Johnson"
        },
        capacity: {
            totalBeds: 12,
            availableBeds: 3
        },
        specialties: ["Post-Surgical", "Wound Care", "Physical Therapy"],
        insuranceAccepted: ["Medicare", "Medicaid", "Blue Cross"],
        rating: 4.8,
        responseTime: "15 min",
        successRate: 96
    },
    {
        name: "Harmony Healthcare Center",
        address: {
            street: "456 Elm Avenue",
            city: "St. Paul",
            state: "MN",
            zip: "55102"
        },
        contact: {
            phone: "(651) 555-0200",
            email: "care@harmonyhc.com",
            contactPerson: "Mike Davis"
        },
        capacity: {
            totalBeds: 20,
            availableBeds: 1
        },
        specialties: ["Rehabilitation", "Cardiac Care", "Respiratory Care"],
        insuranceAccepted: ["Medicare", "Aetna", "UnitedHealth"],
        rating: 4.6,
        responseTime: "30 min",
        successRate: 92
    },
    {
        name: "Willow Creek Rehabilitation",
        address: {
            street: "789 Pine Road",
            city: "Bloomington",
            state: "MN",
            zip: "55425"
        },
        contact: {
            phone: "(952) 555-0300",
            email: "admin@willowcreek.com",
            contactPerson: "Lisa Chen"
        },
        capacity: {
            totalBeds: 30,
            availableBeds: 8
        },
        specialties: ["Orthopedic Rehab", "Neuro Rehab", "Speech Therapy"],
        insuranceAccepted: ["All Major Insurance"],
        rating: 4.9,
        responseTime: "20 min",
        successRate: 98
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carelink');
        
        // Clear existing data
        await Facility.deleteMany({});
        
        // Insert seed data
        await Facility.insertMany(seedData);
        
        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();