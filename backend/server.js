const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Order = require('./models/Order');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// ====================== RESTAURANT ROUTES ======================

// Get all approved restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isApproved: true });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch restaurants' });
  }
});

// Get all restaurants for Admin (including unapproved)
app.get('/api/admin/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin restaurants' });
  }
});

// Get single restaurant with menu (merges MenuItem collection data)
app.get('/api/restaurant/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ id: parseInt(req.params.id) });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Fetch vendor menu items from MenuItem collection
    let menuCategories = [];
    if (restaurant.vendorEmail) {
      const vendorItems = await MenuItem.find({
        vendorEmail: restaurant.vendorEmail,
        isAvailable: true
      }).sort({ category: 1 });

      if (vendorItems.length > 0) {
        // Group by category
        const grouped = {};
        vendorItems.forEach(item => {
          const cat = item.category || 'Uncategorized';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push({
            _id: item._id,
            id: item._id.toString(),
            name: item.name,
            price: item.price,
            desc: '',
            image: item.image || ''
          });
        });
        menuCategories = Object.entries(grouped).map(([category, items]) => ({
          category,
          items
        }));
      }
    }

    // If no vendor menu items, fall back to legacy menu array
    if (menuCategories.length === 0 && restaurant.menu && restaurant.menu.length > 0) {
      menuCategories = [{
        category: 'All Items',
        items: restaurant.menu
      }];
    }

    const responseData = restaurant.toObject();
    responseData.menuCategories = menuCategories;

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch restaurant details' });
  }
});

// Create or Update Restaurant (for Vendors)
app.post('/api/restaurants/vendor/:email', async (req, res) => {
  try {
    const { name, cuisine, deliveryTime, deliveryFee, image, logo, address, location, contactInfo } = req.body;
    const vendorEmail = req.params.email;

    let restaurant = await Restaurant.findOne({ vendorEmail });

    if (restaurant) {
      // Update
      restaurant = await Restaurant.findOneAndUpdate(
        { vendorEmail },
        { name, cuisine, deliveryTime, deliveryFee, image, logo, address, location, contactInfo },
        { returnDocument: 'after' }
      );
    } else {
      // Create
      restaurant = new Restaurant({
        id: Date.now(), // Simplified unique ID
        name,
        cuisine,
        deliveryTime: deliveryTime || '30-45 mins',
        deliveryFee: deliveryFee || 99,
        image: image || '',
        logo: logo || '',
        address: address || '',
        location: location || { lat: 30.2982, lng: 71.9333 },
        contactInfo: contactInfo || '',
        vendorEmail,
        isApproved: false
      });
      await restaurant.save();
    }

    res.json({ success: true, restaurant });
  } catch (error) {
    console.error('Restaurant update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update restaurant profile' });
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
    const email = req.params.email;
    // Escape special characters in email for regex
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const orders = await Order.find({ 
      userEmail: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } 
    }).sort({ createdAt: -1 });
    
    console.log(`Fetched ${orders.length} orders for: ${email}`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user orders' });
  }
});

// User Registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const assignedRole = role || 'customer';
    
    const newUser = new User({
      name,
      email,
      phone,
      password,
      role: email === "admin@shopeedo.com" ? "admin" : assignedRole,
      isApproved: (assignedRole === 'rider' || assignedRole === 'vendor') ? false : true,
      licenseNumber: req.body.licenseNumber || '',
      cnic: req.body.cnic || '',
      vehicleType: req.body.vehicleType || ''
    });

    await newUser.save();

    // If Vendor, also create a Restaurant entry
    if (assignedRole === 'vendor') {
      const newRestaurant = new Restaurant({
        id: Date.now(),
        name: req.body.restaurantName || (name + "'s Kitchen"),
        cuisine: 'Various',
        address: req.body.address || '',
        vendorEmail: email,
        isApproved: false
      });
      await newRestaurant.save();
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { name, email, role: newUser.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
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

    if (!user.isApproved) {
      return res.status(403).json({ success: false, message: 'Your account is pending admin approval' });
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

// Update User Profile
app.patch('/api/users/profile', async (req, res) => {
  try {
    const { email, name, phone, address } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required to identify user' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { 
        name, 
        phone, 
        address,
        licenseNumber: req.body.licenseNumber,
        cnic: req.body.cnic,
        vehicleType: req.body.vehicleType,
        documents: req.body.documents
      },
      { returnDocument: 'after' }
    );

    if (updatedUser) {
      res.json({ 
        success: true, 
        user: { 
          name: updatedUser.name, 
          email: updatedUser.email, 
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address,
          licenseNumber: updatedUser.licenseNumber,
          cnic: updatedUser.cnic,
          vehicleType: updatedUser.vehicleType,
          documents: updatedUser.documents
        } 
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Place new order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, address, deliveryLocation, total, paymentMethod, paymentStatus, userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }

    // Fetch pickup location and restaurant emails for items
    let pickupLocation = { lat: 30.2982, lng: 71.9333 }; // Default
    const itemsWithEmails = [...items];

    if (items.length > 0) {
      // Group items by restaurant to minimize lookups
      const uniqueRestaurantIds = [...new Set(items.map(i => i.restaurantId))];
      
      for (const restId of uniqueRestaurantIds) {
        let restaurant;
        // Check if restId is a valid MongoDB ObjectId
        if (require('mongoose').Types.ObjectId.isValid(restId)) {
          restaurant = await Restaurant.findById(restId);
        } else {
          // Try searching by custom numeric id
          restaurant = await Restaurant.findOne({ id: restId });
        }

        if (restaurant) {
          if (restaurant.location) pickupLocation = restaurant.location;
          
          // Attach vendorEmail to all items from this restaurant
          itemsWithEmails.forEach(item => {
            if (item.restaurantId.toString() === restId.toString()) {
              item.restaurantEmail = restaurant.vendorEmail;
            }
          });
        }
      }
    }

    const newOrder = new Order({
      orderId: 'ORD' + Date.now().toString().slice(-6),
      userEmail,
      items: itemsWithEmails,
      address,
      deliveryLocation,
      pickupLocation,               // ← Save pickup location
      total,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentStatus || 'pending',
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
      { returnDocument: 'after' }
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

// ====================== RIDER ROUTES ======================

// Get available orders for riders (status 'ready')
app.get('/api/orders/available', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'ready', riderEmail: null }).sort({ createdAt: 1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching available orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch available orders' });
  }
});

// Get orders assigned to a specific rider
app.get('/api/orders/rider/:email', async (req, res) => {
  try {
    const orders = await Order.find({ riderEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching rider orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rider orders' });
  }
});

// Rider accepts an order
app.patch('/api/orders/:orderId/accept', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { riderEmail } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId, status: 'ready', riderEmail: null },
      { status: 'picked_up', riderEmail },
      { returnDocument: 'after' }
    );

    if (updatedOrder) {
      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(400).json({ success: false, message: 'Order is no longer available or not found' });
    }
  } catch (error) {
    console.error('Accept order error:', error);
    res.status(500).json({ success: false, message: 'Failed to accept order' });
  }
});

// Rider marks order as delivered
app.patch('/api/orders/:orderId/deliver', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { riderEmail } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId, riderEmail, status: 'picked_up' },
      { status: 'delivered' },
      { returnDocument: 'after' }
    );

    if (updatedOrder) {
      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(400).json({ success: false, message: 'Could not deliver this order' });
    }
  } catch (error) {
    console.error('Deliver order error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark as delivered' });
  }
});

// Update rider's current location (general)
app.patch('/api/users/:email/location', async (req, res) => {
  try {
    const { email } = req.params;
    const { location } = req.body; // { lat, lng }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { location },
      { returnDocument: 'after' }
    );

    if (updatedUser) {
      res.json({ success: true, location: updatedUser.location });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('User location update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update location' });
  }
});

// Update rider location for a specific order
app.patch('/api/orders/:orderId/rider-location', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { location } = req.body; // { lat, lng }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { riderLocation: location },
      { returnDocument: 'after' }
    );

    if (updatedOrder) {
      res.json({ success: true, riderLocation: updatedOrder.riderLocation });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    console.error('Order rider location update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order rider location' });
  }
});

// ====================== MOCK PAYMENT ROUTE ======================
app.post('/api/payment/process', async (req, res) => {
  try {
    const { cardNumber, amount } = req.body;
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation
    if (!cardNumber || cardNumber.length < 15) {
      return res.status(400).json({ success: false, message: 'Invalid card details' });
    }
    
    // Simulate successful payment
    res.json({ success: true, transactionId: 'TXN' + Date.now(), message: 'Payment successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
});


// ====================== ADMIN & VENDOR ROUTES ======================

// Admin Approves a Restaurant
app.patch('/api/admin/restaurants/:id/approve', async (req, res) => {
  try {
    const updated = await Restaurant.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { isApproved: true },
      { returnDocument: 'after' }
    );
    if (updated) {
      res.json({ success: true, restaurant: updated });
    } else {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve restaurant' });
  }
});

// Admin fetches pending riders
app.get('/api/admin/pending-riders', async (req, res) => {
  try {
    const riders = await User.find({ isApproved: false, role: 'rider' });
    res.json(riders);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch pending riders' });
  }
});

// Admin approves a rider
app.patch('/api/admin/riders/:id/approve', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { returnDocument: 'after' }
    );
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve user' });
  }
});

// Get orders for a vendor's restaurants
app.get('/api/orders/vendor/:email', async (req, res) => {
  try {
    const vendorEmail = req.params.email;
    
    // Find all restaurants owned by this vendor to get their IDs
    const vendorRestaurants = await Restaurant.find({ vendorEmail });
    const restaurantIds = vendorRestaurants.map(r => r.id.toString());
    const restaurantObjectIds = vendorRestaurants.map(r => r._id.toString());
    const allRelevantIds = [...restaurantIds, ...restaurantObjectIds];

    // Find orders that contain items from any of these restaurants (check by email or ID)
    const orders = await Order.find({ 
      $or: [
        { 'items.restaurantEmail': vendorEmail },
        { 'items.restaurantId': { $in: allRelevantIds } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch vendor orders' });
  }
});

// Vendor updates order status
app.patch('/api/orders/:orderId/vendor-status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'preparing', 'ready'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update for vendor' });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { returnDocument: 'after' }
    );

    if (updatedOrder) {
      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    console.error('Vendor status update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

// ====================== MENU ITEM ROUTES ======================

// Get all menu items for a vendor
app.get('/api/menu/vendor/:email', async (req, res) => {
  try {
    const items = await MenuItem.find({ vendorEmail: req.params.email }).sort({ category: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching vendor menu:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch menu items' });
  }
});

// Create a new menu item for a vendor
app.post('/api/menu/vendor/:email', async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    // Find the vendor's first restaurant to link the item
    const restaurant = await Restaurant.findOne({ vendorEmail: req.params.email });

    const newItem = new MenuItem({
      name,
      price,
      category,
      image: image || '',
      vendorEmail: req.params.email,
      restaurantId: restaurant ? restaurant.id : null
    });

    await newItem.save();
    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to create menu item' });
  }
});

// Delete a menu item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.json({ success: true, message: 'Menu item deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Menu item not found' });
    }
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete menu item' });
  }
});

// Get all distinct categories (for customer-facing category chips)
app.get('/api/menu/categories', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Get all menu items by category (for CategoryPage)
app.get('/api/menu/category/:name', async (req, res) => {
  try {
    const categoryName = req.params.name;
    // Case-insensitive search
    const items = await MenuItem.find({
      category: { $regex: new RegExp(`^${categoryName}$`, 'i') },
      isAvailable: true
    });

    // Group items by vendor and attach restaurant info
    const vendorEmails = [...new Set(items.map(i => i.vendorEmail))];
    const restaurants = await Restaurant.find({ vendorEmail: { $in: vendorEmails }, isApproved: true });

    const restaurantMap = {};
    restaurants.forEach(r => {
      restaurantMap[r.vendorEmail] = {
        id: r.id,
        name: r.name,
        cuisine: r.cuisine,
        rating: r.rating,
        deliveryTime: r.deliveryTime,
        deliveryFee: r.deliveryFee,
        image: r.image
      };
    });

    // Return items enriched with restaurant info
    const enrichedItems = items.map(item => ({
      ...item.toObject(),
      restaurant: restaurantMap[item.vendorEmail] || null
    }));

    res.json(enrichedItems);
  } catch (error) {
    console.error('Error fetching items by category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category items' });
  }
});

// ==========================================
// RATING SYSTEM
// ==========================================

// Rate an order and update restaurant average
app.post('/api/orders/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    const orderId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Invalid rating value' });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Can only rate delivered orders' });
    }

    if (order.isRated) {
      return res.status(400).json({ success: false, message: 'Order is already rated' });
    }

    // 1. Update Order
    order.isRated = true;
    order.rating = rating;
    await order.save();

    // 2. Find associated restaurants and update their ratings
    // An order might have items from multiple restaurants. We will apply the rating to all involved restaurants for simplicity, or just the primary one.
    const uniqueRestaurantIds = [...new Set(order.items.map(i => i.restaurantId))];
    
    for (const restIdStr of uniqueRestaurantIds) {
      let restaurant = null;
      if (require('mongoose').Types.ObjectId.isValid(restIdStr)) {
        restaurant = await Restaurant.findById(restIdStr);
      }
      if (!restaurant) {
        restaurant = await Restaurant.findOne({ id: isNaN(parseInt(restIdStr)) ? 0 : parseInt(restIdStr) });
      }

      if (restaurant) {
        const currentAvg = restaurant.rating || 4.0;
        const currentCount = restaurant.ratingCount || 1;
        
        // Calculate new average: ((oldAvg * count) + newRating) / (count + 1)
        const newAvg = ((currentAvg * currentCount) + rating) / (currentCount + 1);
        
        restaurant.rating = parseFloat(newAvg.toFixed(1));
        restaurant.ratingCount = currentCount + 1;
        await restaurant.save();
      }
    }

    res.json({ success: true, message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ success: false, message: 'Failed to submit rating' });
  }
});

// ==========================================
// PAYMENT MANAGEMENT
// ==========================================
const PaymentMethod = require('./models/PaymentMethod');

// Get saved cards for user
app.get('/api/payments/:email', async (req, res) => {
  try {
    const cards = await PaymentMethod.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment methods' });
  }
});

// Add a new card
app.post('/api/payments', async (req, res) => {
  try {
    const { userEmail, cardholderName, cardNumber, expiryDate, cardType } = req.body;
    
    // In a real app, we would tokenize this via Stripe. Here we just mask it.
    const last4 = cardNumber.slice(-4);
    const cardNumberMasked = `**** **** **** ${last4}`;

    const newCard = new PaymentMethod({
      userEmail,
      cardholderName,
      cardNumberMasked,
      expiryDate,
      cardType: cardType || 'Visa'
    });

    await newCard.save();
    res.status(201).json({ success: true, card: newCard });
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).json({ success: false, message: 'Failed to add payment method' });
  }
});

// Delete a card
app.delete('/api/payments/:id', async (req, res) => {
  try {
    const deleted = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.json({ success: true, message: 'Card deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Card not found' });
    }
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ success: false, message: 'Failed to delete payment method' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});