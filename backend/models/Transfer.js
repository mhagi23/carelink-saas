const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    patient: {
        name: String,
        mrn: String,
        age: Number,
        diagnosis: String
    },
    fromHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    toFacility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
    },
    careRequirements: [String],
    insurance: {
        provider: String,
        memberId: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: String,
    requestDate: {
        type: Date,
        default: Date.now
    },
    transferDate: Date,
    completedDate: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Transfer', transferSchema);
