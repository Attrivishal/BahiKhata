const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new ContactMessage({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
