const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'staff', 'viewer'],
        default: 'staff'
    },
    contact: {
        name: String,
        phone: String,
        department: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
