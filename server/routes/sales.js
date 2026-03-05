const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const sales = await Sale.find({ userId: req.userId }).sort({ date: -1 });
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { amount, productName } = req.body;
        const newSale = new Sale({ userId: req.userId, amount, productName });
        await newSale.save();
        res.status(201).json(newSale);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
