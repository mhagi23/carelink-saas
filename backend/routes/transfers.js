const express = require('express');
const router = express.Router();

// Mock transfers data
let transfers = [
    {
        id: 1,
        patientName: "John Doe",
        patientMRN: "MRN001234",
        fromHospital: "St. Mary's Hospital",
        toFacility: "Sunshine Senior Care",
        status: "pending",
        requestDate: new Date().toISOString(),
        careType: "Post-Surgical Care",
        insurance: "Medicare"
    }
];

// GET all transfers
router.get('/', (req, res) => {
    res.json(transfers);
});

// CREATE new transfer
router.post('/', (req, res) => {
    const newTransfer = {
        id: transfers.length + 1,
        ...req.body,
        status: 'pending',
        requestDate: new Date().toISOString()
    };
    
    transfers.push(newTransfer);
    res.status(201).json(newTransfer);
});

// UPDATE transfer status
router.patch('/:id/status', (req, res) => {
    const transfer = transfers.find(t => t.id == req.params.id);
    if (transfer) {
        transfer.status = req.body.status;
        res.json(transfer);
    } else {
        res.status(404).json({ error: 'Transfer not found' });
    }
});

module.exports = router;
