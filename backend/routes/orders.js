const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  const order = new Order({
    items: req.body.items,
    subtotal: req.body.subtotal,
    tax: req.body.tax,
    tip: req.body.tip,
    discount: req.body.discount,
    total: req.body.total,
    paymentMethod: req.body.paymentMethod,
    tableId: req.body.tableId,
    type: req.body.type,
    cashier: req.body.cashier,
    splitBill: req.body.splitBill,
    customerPhone: req.body.customerPhone,
    status: req.body.status || 'pending'
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order status
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.body.status) order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;