const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Order = require('./models/Order');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Get all restaurants (fake for now)
const restaurants = [
  { id: 1, name: 'Pizza Point Jahanian', cuisine: 'Pizza • Fast Food', rating: 4.6 },
  { id: 2, name: 'Biryani House', cuisine: 'Biryani • Pakistani', rating: 4.8 },
  { id: 3, name: 'Burger Lab', cuisine: 'Burgers • American', rating: 4.4 },
];

// Routes
app.get('/api/restaurants', (req, res) => {
  res.json(restaurants);
});

app.get('/api/restaurant/:id', (req, res) => {
  const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
  if (restaurant) {
    restaurant.menu = [
      { id: 'p1', name: 'Margherita', price: 890, desc: 'Classic pizza' },
      { id: 'p2', name: 'Pepperoni', price: 1090, desc: 'Spicy pepperoni' },
      { id: 'p3', name: 'BBQ Chicken', price: 1190, desc: 'BBQ sauce, chicken' },
    ];
    res.json(restaurant);
  } else {
    res.status(404).json({ message: 'Restaurant not found' });
  }
});

// Place Order - Now saves to MongoDB
app.post('/api/orders', async (req, res) => {
  try {
    const { items, address, total, paymentMethod } = req.body;

    const newOrder = new Order({
      orderId: 'ORD' + Date.now().toString().slice(-6),
      items,
      address,
      total,
      paymentMethod: paymentMethod || 'cash',
      status: 'pending'
    });

    await newOrder.save();

    console.log('✅ New Order Saved to Database:', newOrder.orderId);

    res.status(201).json({
      success: true,
      orderId: newOrder.orderId,
      message: 'Order placed successfully!',
      estimatedDelivery: '30-45 minutes'
    });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});