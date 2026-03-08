const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const inventory = await Inventory.find({ userId: req.userId }).sort({ itemName: 1 });
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { itemName, quantity, lowStockAlert } = req.body;
        const newInventoryItem = new Inventory({ userId: req.userId, itemName, quantity, lowStockAlert });
        await newInventoryItem.save();
        res.status(201).json(newInventoryItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
