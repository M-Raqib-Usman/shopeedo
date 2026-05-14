const mongoose = require('mongoose');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopeedo';

const vendors = [
  {
    user: { name: 'Pizza Hut', email: 'pizzahut@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03001112223' },
    restaurant: { name: 'The Pizza Hut', cuisine: 'Pizza, Fast Food, Italian', address: 'Main Blvd, Jahanian', deliveryFee: 99, rating: 4.5 },
    menu: [
      { name: 'Chicken Tikka Pizza', price: 1200, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' },
      { name: 'Pepperoni Feast', price: 1400, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e' },
      { name: 'Garlic Bread', price: 350, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c' }
    ]
  },
  {
    user: { name: 'Desi Bites', email: 'desibites@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03004445556' },
    restaurant: { name: 'Desi Bites', cuisine: 'Pakistani, Biryani, Karahi', address: 'Food Street, Jahanian', deliveryFee: 50, rating: 4.8 },
    menu: [
      { name: 'Special Chicken Biryani', price: 350, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8' },
      { name: 'Chicken Karahi (Full)', price: 1800, category: 'Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398' },
      { name: 'Seekh Kabab (4 pcs)', price: 450, category: 'BBQ', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0' }
    ]
  },
  {
    user: { name: 'Burger Lab', email: 'burgerlab@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03007778889' },
    restaurant: { name: 'Burger Lab', cuisine: 'Burgers, American, Shakes', address: 'Model Town, Jahanian', deliveryFee: 120, rating: 4.4 },
    menu: [
      { name: 'Big Bang Burger', price: 650, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
      { name: 'Zinger Deluxe', price: 450, category: 'Burgers', image: 'https://images.unsplash.com/photo-1513185158878-8d8c196b3c6c' },
      { name: 'Loaded Fries', price: 300, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877' }
    ]
  },
  {
    user: { name: 'China Town', email: 'goldendragon@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03002223334' },
    restaurant: { name: 'Golden Dragon', cuisine: 'Chinese, Asian, Soup', address: 'Railway Road, Jahanian', deliveryFee: 80, rating: 4.2 },
    menu: [
      { name: 'Chicken Manchurian', price: 750, category: 'Chinese', image: 'https://images.unsplash.com/photo-1512058560366-cd2427ffaa3a' },
      { name: 'Egg Fried Rice', price: 500, category: 'Chinese', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b' },
      { name: 'Hot & Sour Soup', price: 400, category: 'Chinese', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd' }
    ]
  },
  {
    user: { name: 'Sweet Tooth', email: 'sweettooth@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03005556667' },
    restaurant: { name: 'Sweet Tooth', cuisine: 'Desserts, Ice Cream, Cakes', address: 'Market Area, Jahanian', deliveryFee: 60, rating: 4.7 },
    menu: [
      { name: 'Chocolate Fudge Cake', price: 1500, category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' },
      { name: 'Vanilla Ice Cream (Large)', price: 400, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1570197788417-0e93323c33bd' },
      { name: 'Gulab Jamun (1kg)', price: 800, category: 'Desserts', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848' }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const v of vendors) {
      // 1. Clean up existing data for this vendor
      await User.deleteOne({ email: v.user.email });
      await Restaurant.deleteOne({ vendorEmail: v.user.email });
      await MenuItem.deleteMany({ vendorEmail: v.user.email });

      // 2. Create User
      const user = new User(v.user);
      await user.save();

      // 3. Create Restaurant
      const restId = Math.floor(Math.random() * 1000000);
      const restaurant = new Restaurant({
        ...v.restaurant,
        id: restId,
        vendorEmail: v.user.email,
        isApproved: true,
        location: { lat: 30.29 + (Math.random() * 0.05), lng: 71.93 + (Math.random() * 0.05) }
      });
      await restaurant.save();

      // 4. Create Menu Items
      for (const m of v.menu) {
        const item = new MenuItem({
          ...m,
          vendorEmail: v.user.email,
          restaurantId: restId
        });
        await item.save();
      }

      console.log(`✅ Seeded: ${v.restaurant.name} (${v.user.email})`);
    }

    console.log('Done! All vendors seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();
