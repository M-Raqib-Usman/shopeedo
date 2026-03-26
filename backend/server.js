const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Fake restaurants data (same as your frontend)
const restaurants = [
  {
    id: 1,
    name: 'Pizza Point Jahanian',
    cuisine: 'Pizza • Fast Food',
    rating: 4.6,
    deliveryTime: '20-35 min',
    deliveryFee: 99,
  },
  {
    id: 2,
    name: 'Biryani House',
    cuisine: 'Biryani • Pakistani',
    rating: 4.8,
    deliveryTime: '25-40 min',
    deliveryFee: 0,
  },
  // Add more if you want
];

// API Routes
app.get('/api/restaurants', (req, res) => {
  res.json(restaurants);
});

app.get('/api/restaurant/:id', (req, res) => {
  const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
  if (restaurant) {
    // Fake menu for demo
    restaurant.menu = [
      { id: 'p1', name: 'Margherita', price: 890, desc: 'Classic pizza' },
      { id: 'p2', name: 'Pepperoni', price: 1090, desc: 'Spicy pepperoni' },
    ];
    res.json(restaurant);
  } else {
    res.status(404).json({ message: 'Restaurant not found' });
  }
});

// Place Order Endpoint (Important for demo)
app.post('/api/orders', (req, res) => {
  const { items, address, total, restaurantId } = req.body;
  
  console.log('✅ New Order Received:');
  console.log('Address:', address);
  console.log('Total:', total);
  console.log('Items:', items);

  // In real app, save to MongoDB here

  res.json({
    success: true,
    orderId: 'ORD' + Date.now().toString().slice(-6),
    message: 'Order placed successfully! Your food is being prepared.',
    estimatedDelivery: '30-45 minutes'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});