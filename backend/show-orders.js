const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sajha-pos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

// Order schema (same as in models/Order.js)
const orderSchema = new mongoose.Schema({
  items: [{
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
  }],
  total: Number,
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi'],
    required: true
  },
  tableId: String,
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

const Order = mongoose.model('Order', orderSchema);

// Function to show all orders
async function showOrders() {
  try {
    const orders = await Order.find().sort({ timestamp: -1 });
    console.log(`\n=== ORDERS IN DATABASE (${orders.length} total) ===\n`);

    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order._id}`);
      console.log(`   Date: ${order.timestamp.toLocaleString()}`);
      console.log(`   Table: ${order.tableId || 'N/A'}`);
      console.log(`   Payment: ${order.paymentMethod}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Total: Rs ${order.total}`);
      console.log(`   Items:`);
      order.items.forEach(item => {
        console.log(`     - ${item.name} x${item.qty} = Rs ${item.totalPrice || item.price * item.qty}`);
      });
      console.log('');
    });

    if (orders.length === 0) {
      console.log('No orders found in database.');
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
showOrders();