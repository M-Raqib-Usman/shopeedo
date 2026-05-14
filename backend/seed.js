const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');

dotenv.config();

const DB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopeedo';

const seedData = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to DB');

    // Create a default vendor user
    const vendorEmail = 'vendor@shopeedo.com';
    let vendor = await User.findOne({ email: vendorEmail });
    
    if (!vendor) {
      vendor = new User({
        name: 'Test Vendor',
        email: vendorEmail,
        phone: '1234567890',
        password: 'password123',
        role: 'vendor'
      });
      await vendor.save();
      console.log('Created test vendor user: vendor@shopeedo.com');
    }

    // Clear existing restaurants to avoid duplicates on multiple runs
    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants');

    const restaurants = [
      {
        id: 1,
        name: 'Pizza Point Sahiwal',
        cuisine: 'Pizza • Fast Food',
        rating: 4.6,
        deliveryTime: '20-35 min',
        deliveryFee: 99,
        vendorEmail: vendorEmail,
        isApproved: true,
        menu: [
          { id: 'p1', name: 'Margherita', price: 890, desc: 'Classic cheese pizza' },
          { id: 'p2', name: 'Pepperoni', price: 1090, desc: 'Extra pepperoni' },
          { id: 'p3', name: 'BBQ Chicken', price: 1190, desc: 'BBQ sauce, chicken, onions' },
          { id: 'b1', name: 'Classic Beef Burger', price: 650, desc: 'Beef patty with cheese' },
        ]
      },
      {
        id: 2,
        name: 'Biryani House',
        cuisine: 'Biryani • Pakistani',
        rating: 4.8,
        deliveryTime: '25-40 min',
        deliveryFee: 0,
        vendorEmail: 'vendor2@shopeedo.com', // testing another vendor
        isApproved: true,
        menu: [
          { id: 'b1', name: 'Chicken Biryani', price: 450, desc: 'Spicy chicken biryani' },
          { id: 'b2', name: 'Beef Biryani', price: 550, desc: 'Tender beef biryani' }
        ]
      },
      {
        id: 3,
        name: 'Burger Lab',
        cuisine: 'Burgers • American',
        rating: 4.4,
        deliveryTime: '15-30 min',
        deliveryFee: 149,
        vendorEmail: vendorEmail,
        isApproved: false, // For admin to approve
        menu: [
          { id: 'm1', name: 'Zinger Burger', price: 550, desc: 'Crispy chicken burger' },
          { id: 'm2', name: 'Smash Burger', price: 750, desc: 'Double beef smash burger' }
        ]
      },
    ];

    await Restaurant.insertMany(restaurants);
    console.log('Inserted fake restaurant data successfully');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
