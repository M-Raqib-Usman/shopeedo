const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Order = require('./models/Order');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Fake restaurants data (we can make this dynamic later)
const restaurants = [
  {
    id: 1,
    name: 'Pizza Point Jahanian',
    cuisine: 'Pizza • Fast Food',
    rating: 4.6,
    deliveryTime: '20-35 min',
    deliveryFee: 99
  },
  {
    id: 2,
    name: 'Biryani House',
    cuisine: 'Biryani • Pakistani',
    rating: 4.8,
    deliveryTime: '25-40 min',
    deliveryFee: 0
  },
  {
    id: 3,
    name: 'Burger Lab',
    cuisine: 'Burgers • American',
    rating: 4.4,
    deliveryTime: '15-30 min',
    deliveryFee: 149
  },
];

// ====================== ROUTES ======================

// Get all restaurants
app.get('/api/restaurants', (req, res) => {
  res.json(restaurants);
});

// Get single restaurant with menu
app.get('/api/restaurant/:id', (req, res) => {
  const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
  if (restaurant) {
    restaurant.menu = [
      { id: 'p1', name: 'Margherita', price: 890, desc: 'Classic cheese pizza' },
      { id: 'p2', name: 'Pepperoni', price: 1090, desc: 'Extra pepperoni' },
      { id: 'p3', name: 'BBQ Chicken', price: 1190, desc: 'BBQ sauce, chicken, onions' },
      { id: 'b1', name: 'Classic Beef Burger', price: 650, desc: 'Beef patty with cheese' },
    ];
    res.json(restaurant);
  } else {
    res.status(404).json({ message: 'Restaurant not found' });
  }
});

// Get all orders (for Admin and User Orders page)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get orders for a specific logged-in user
app.get('/api/orders/user/:email', async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email })
                             .sort({ createdAt: -1 });
    
    console.log(`Fetched ${orders.length} orders for ${req.params.email}`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user orders' });
  }
});

// User Registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const newUser = new User({
      name,
      email,
      phone,
      password,        // In real project, hash this password
      role: email === "admin@shopeedo.com" ? "admin" : "customer"
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { name, email, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// User Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Simple password check (in real app, use bcrypt)
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Place new order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, address, total, paymentMethod, userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    const newOrder = new Order({
      orderId: 'ORD' + Date.now().toString().slice(-6),
      userEmail,                    // ← Save user email
      items,
      address,
      total,
      paymentMethod: paymentMethod || 'cash',
      status: 'pending'
    });

    await newOrder.save();

    console.log(`✅ New Order Saved: ${newOrder.orderId} for ${userEmail}`);

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

// Update order status (for Admin Panel)
app.patch('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (updatedOrder) {
      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});