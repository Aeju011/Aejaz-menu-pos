const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  qty: Number,
  selectedModifiers: [{
    id: String,
    name: String,
    price: Number
  }],
  note: String,
  totalPrice: Number
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  subtotal: Number,
  tax: Number,
  tip: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: Number,
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi'],
    required: true
  },
  tableId: String,
  type: String,
  cashier: String,
  splitBill: {
    type: Number,
    default: 1
  },
  customerPhone: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Order', orderSchema);