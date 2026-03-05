const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    lowStockAlert: { type: Number, required: true, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
