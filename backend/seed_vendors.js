const mongoose = require('mongoose');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopeedo';

const vendors = [
  {
    user: { name: 'Pizza Hut', email: 'pizzahut@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03001112223' },
    restaurant: {
      name: 'The Pizza Hut',
      cuisine: 'Pizza, Fast Food, Italian',
      address: 'Main Blvd, Sahiwal',
      deliveryFee: 99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80&auto=format&fit=crop'
    },
    menu: [
      { name: 'Chicken Tikka Pizza', price: 1200, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop', desc: 'Spicy chicken tikka chunks with onions and green peppers.' },
      { name: 'Pepperoni Feast', price: 1400, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80&auto=format&fit=crop', desc: 'Loaded with premium pepperoni and extra mozzarella cheese.' },
      { name: 'Garlic Bread', price: 350, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&q=80&auto=format&fit=crop', desc: 'Freshly baked bread with garlic butter and herbs.' },
      { name: 'Cheese Sticks', price: 450, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1548340748-6d2b7d7ca280?w=800&q=80&auto=format&fit=crop', desc: 'Gooey mozzarella sticks with marinara dip.' }
    ]
  },
  {
    user: { name: 'Desi Bites', email: 'desibites@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03004445556' },
    restaurant: {
      name: 'Desi Bites',
      cuisine: 'Pakistani, Biryani, Karahi',
      address: 'Food Street, Sahiwal',
      deliveryFee: 50,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1200&q=80&auto=format&fit=crop'
    },
    menu: [
      { name: 'Special Chicken Biryani', price: 350, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800&q=80&auto=format&fit=crop', desc: 'Aromatic basmati rice cooked with spicy chicken and secret herbs.' },
      { name: 'Mutton Karahi', price: 2800, category: 'Karahi', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80&auto=format&fit=crop', desc: 'Traditional mutton karahi cooked in desi ghee.' },
      { name: 'Seekh Kebab (4pcs)', price: 600, category: 'BBQ', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80&auto=format&fit=crop', desc: 'Minced meat kebabs grilled over charcoal.' }
    ]
  },
  {
    user: { name: 'Burger Lab', email: 'burgerlab@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03007778889' },
    restaurant: {
      name: 'Burger Lab',
      cuisine: 'Burgers, American, Shakes',
      address: 'Model Town, Sahiwal',
      deliveryFee: 120,
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80&auto=format&fit=crop'
    },
    menu: [
      { name: 'Big Bang Burger', price: 650, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80&auto=format&fit=crop', desc: 'Double patty, triple cheese, and our signature sauce.' },
      { name: 'Zinger Burger', price: 450, category: 'Burgers', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80&auto=format&fit=crop', desc: 'Crispy chicken breast with lettuce and mayo.' },
      { name: 'Loaded Fries', price: 400, category: 'Fast Food', image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&q=80&auto=format&fit=crop', desc: 'Cheese, olives, and jalapenos over crispy fries.' }
    ]
  },
  {
    user: { name: 'Golden Dragon', email: 'goldendragon@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03008889990' },
    restaurant: {
      name: 'Golden Dragon',
      cuisine: 'Chinese, Thai, Asian',
      address: 'Faisal Town, Sahiwal',
      deliveryFee: 80,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200&q=80&auto=format&fit=crop'
    },
    menu: [
      { name: 'Chicken Manchurian', price: 850, category: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80&auto=format&fit=crop', desc: 'Classic Chinese dish in spicy red sauce.' },
      { name: 'Beef Chili Dry', price: 1100, category: 'Chinese', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80&auto=format&fit=crop', desc: 'Spicy sliced beef with green chilies and ginger.' },
      { name: 'Hot & Sour Soup', price: 350, category: 'Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80&auto=format&fit=crop', desc: 'Traditional spicy and tangy soup.' }
    ]
  },
  {
    user: { name: 'Sweet Tooth', email: 'sweettooth@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03001112229' },
    restaurant: {
      name: 'Sweet Tooth',
      cuisine: 'Desserts, Ice Cream, Cakes',
      address: 'Main Blvd, Sahiwal',
      deliveryFee: 60,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80&auto=format&fit=crop'
    },
    menu: [
      { name: 'Chocolate Fudge Cake', price: 1500, category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80&auto=format&fit=crop', desc: 'Rich chocolate cake with moist layers.' },
      { name: 'Vanilla Bean Ice Cream', price: 300, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80&auto=format&fit=crop', desc: 'Classic creamy vanilla with real bean specks.' },
      { name: 'Strawberry Cheesecake', price: 450, category: 'Desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80&auto=format&fit=crop', desc: 'New York style cheesecake with strawberry topping.' }
    ]
  },
  {
    user: { name: 'The Steakhouse', email: 'steakhouse@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03001112221' },
    restaurant: { 
      name: 'The Grill Master', 
      cuisine: 'Steakhouse, Continental, BBQ', 
      address: 'Civil Lines, Sahiwal', 
      deliveryFee: 150, 
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1546241071-87a1c5d360ee?w=1200&q=80&auto=format&fit=crop'
    },
    menu: [
      { name: 'Prime Ribeye Steak', price: 2500, category: 'Steak', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80&auto=format&fit=crop', desc: 'Premium dry-aged ribeye served with mash and veggies.' },
      { name: 'Grilled Chicken Platter', price: 1200, category: 'Continental', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80&auto=format&fit=crop', desc: 'Juicy grilled chicken breasts with herb butter.' }
    ]
  },
  {
    user: { name: 'Pasta Bistro', email: 'pasta@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03001112224' },
    restaurant: { 
      name: 'Pasta La Vista', 
      cuisine: 'Italian, Pasta, Pizza', 
      address: 'Cantt Area, Sahiwal', 
      deliveryFee: 100, 
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=1200&q=80&auto=format&fit=crop'
    },
    menu: [
      { name: 'Fettuccine Alfredo', price: 950, category: 'Pasta', image: 'https://images.unsplash.com/photo-1645112481338-3566faacb4a5?w=800&q=80&auto=format&fit=crop', desc: 'Creamy white sauce pasta with grilled chicken.' },
      { name: 'Lasagna Bolognese', price: 1200, category: 'Pasta', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80&auto=format&fit=crop', desc: 'Layered pasta with rich meat sauce and cheese.' }
    ]
  },
  {
    user: { name: 'Zen Sushi', email: 'sushi@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03001112222' },
    restaurant: { 
      name: 'Zen Sushi & Asian', 
      cuisine: 'Japanese, Sushi, Asian', 
      address: 'University Road, Sahiwal', 
      deliveryFee: 200, 
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1553621042-f82733b0d1b1?w=1200&q=80&auto=format&fit=crop'
    },
    menu: [
      { name: 'Salmon Nigiri', price: 1200, category: 'Sushi', image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80&auto=format&fit=crop', desc: 'Fresh Atlantic salmon over seasoned rice.' },
      { name: 'Tempura Prawns', price: 1800, category: 'Sushi', image: 'https://images.unsplash.com/photo-1562158074-2735d466136d?w=800&q=80&auto=format&fit=crop', desc: 'Crispy deep-fried prawns with soy dip.' }
    ]
  },
  {
    user: { name: 'Morning Brew', email: 'cafe@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03001112223' },
    restaurant: { 
      name: 'Morning Brew Cafe', 
      cuisine: 'Cafe, Coffee, Bakery', 
      address: 'Mall Road, Sahiwal', 
      deliveryFee: 50, 
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop'
    },
    menu: [
      { name: 'Caramel Macchiato', price: 550, category: 'Coffee', image: 'https://images.unsplash.com/photo-1485808191679-5f63bb3fd8c7?w=800&q=80&auto=format&fit=crop', desc: 'Espresso with steamed milk and caramel drizzle.' },
      { name: 'Blueberry Muffin', price: 250, category: 'Bakery', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&q=80&auto=format&fit=crop', desc: 'Freshly baked muffin with real blueberries.' }
    ]
  },
  {
    user: { name: 'Shawarma Hub', email: 'shawarma@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03001112226' },
    restaurant: { 
      name: 'Shawarma Hub', 
      cuisine: 'Fast Food, Arabian, Rolls', 
      address: 'Food Street, Sahiwal', 
      deliveryFee: 40, 
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1200&q=80&auto=format&fit=crop'
    },
    menu: [
      { name: 'Platter Shawarma', price: 450, category: 'Shawarma', image: 'https://images.unsplash.com/photo-1561651823-347ff6191a8d?w=800&q=80&auto=format&fit=crop', desc: 'Deconstructed shawarma with pita, chicken and tahini.' },
      { name: 'Garlic Mayo Roll', price: 200, category: 'Rolls', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=800&q=80&auto=format&fit=crop', desc: 'Chicken chunks in garlic mayo wrapped in paratha.' }
    ]
  }
];

const riders = [
  { name: 'Ali Rider', email: 'ali@shopeedo.com', password: 'password123', role: 'rider', isApproved: true, phone: '03009990001', vehicleType: 'Bike' },
  { name: 'Usman Rider', email: 'usman@shopeedo.com', password: 'password123', role: 'rider', isApproved: true, phone: '03009990002', vehicleType: 'Car' },
  { name: 'Bilal Rider', email: 'bilal@shopeedo.com', password: 'password123', role: 'rider', isApproved: true, phone: '03009998881', vehicleType: 'Bike' },
  { name: 'Hassan Rider', email: 'hassan@shopeedo.com', password: 'password123', role: 'rider', isApproved: true, phone: '03009998882', vehicleType: 'Bike' }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Clean up ALL existing vendor data completely
    console.log('🧹 Clearing old restaurants and vendor data...');
    await User.deleteMany({ role: { $in: ['vendor', 'rider'] } });
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    for (const v of vendors) {

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
        location: {
          lat: 30.6682 + (Math.random() * 0.01 - 0.005),
          lng: 73.1114 + (Math.random() * 0.01 - 0.005)
        },
        menu: v.menu.map((m, i) => ({
          id: 'm' + i,
          name: m.name,
          price: m.price,
          desc: m.desc,
          image: m.image
        }))
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

      console.log(`✅ Seeded Vendor: ${v.restaurant.name} (${v.user.email} / ${v.user.password})`);
    }

    for (const r of riders) {
      const riderUser = new User(r);
      await riderUser.save();
      console.log(`✅ Seeded Rider: ${r.name} (${r.email} / ${r.password})`);
    }

    console.log('Done! All vendors seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();
