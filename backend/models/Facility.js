const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    contact: {
        phone: String,
        email: String,
        contactPerson: String
    },
    capacity: {
        totalBeds: Number,
        availableBeds: Number
    },
    specialties: [String],
    insuranceAccepted: [String],
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    responseTime: String,
    successRate: Number,
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Facility', facilitySchema);
