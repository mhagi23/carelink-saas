const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
        totalBeds: {
            type: Number,
            required: true
        },
        availableBeds: {
            type: Number,
            required: true
        }
    },
    specialties: [{
        type: String
    }],
    insuranceAccepted: [{
        type: String
    }],
    certifications: [{
        type: String
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    responseTime: {
        type: String,
        default: '30 min'
    },
    successRate: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add indexes for search performance
facilitySchema.index({ 'address.coordinates': '2dsphere' });
facilitySchema.index({ specialties: 1 });
facilitySchema.index({ insuranceAccepted: 1 });

module.exports = mongoose.model('Facility', facilitySchema);