const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Get all inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update inventory
router.post('/', async (req, res) => {
  const { itemId, stock } = req.body;

  try {
    let inventoryItem = await Inventory.findOne({ itemId });
    if (inventoryItem) {
      inventoryItem.stock = stock;
      inventoryItem.lastUpdated = Date.now();
      await inventoryItem.save();
    } else {
      inventoryItem = new Inventory({ itemId, stock });
      await inventoryItem.save();
    }
    res.status(200).json(inventoryItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;