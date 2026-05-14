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
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop'
    },
    menu: [
      { name: 'Chicken Tikka Pizza', price: 1200, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop', desc: 'Spicy chicken tikka chunks with onions and green peppers.' },
      { name: 'Pepperoni Feast', price: 1400, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1780&auto=format&fit=crop', desc: 'Loaded with premium pepperoni and extra mozzarella cheese.' },
      { name: 'Fajita Passion', price: 1300, category: 'Pizza', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1935&auto=format&fit=crop', desc: 'Marinated chicken fajita, onions, and green peppers.' },
      { name: 'Garlic Bread', price: 350, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=1974&auto=format&fit=crop', desc: 'Freshly baked bread with garlic butter and herbs.' },
      { name: 'Potato Skins', price: 450, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2070&auto=format&fit=crop', desc: 'Crispy potato skins topped with cheese and jalapeños.' },
      { name: 'Coca Cola 1.5L', price: 250, category: 'Drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop', desc: 'Chilled soft drink.' }
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
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1974&auto=format&fit=crop'
    },
    menu: [
      { name: 'Special Chicken Biryani', price: 350, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=2010&auto=format&fit=crop', desc: 'Aromatic basmati rice cooked with spicy chicken and secret herbs.' },
      { name: 'Mutton Biryani', price: 650, category: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974&auto=format&fit=crop', desc: 'Premium mutton cooked to perfection with long-grain rice.' },
      { name: 'Chicken Karahi (Half)', price: 950, category: 'Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1974&auto=format&fit=crop', desc: 'Traditional Lahori style karahi cooked in fresh tomatoes.' },
      { name: 'Chicken Karahi (Full)', price: 1800, category: 'Karahi', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1974&auto=format&fit=crop', desc: 'Full portion of our famous desi chicken karahi.' },
      { name: 'Seekh Kabab (4 pcs)', price: 450, category: 'BBQ', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2070&auto=format&fit=crop', desc: 'Juicy minced meat kababs grilled on charcoal.' },
      { name: 'Chicken Tikka (Chest)', price: 350, category: 'BBQ', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=2070&auto=format&fit=crop', desc: 'Large piece of chicken breast marinated in traditional spices.' }
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
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop'
    },
    menu: [
      { name: 'Big Bang Burger', price: 650, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop', desc: 'Double patty, triple cheese, and our signature sauce.' },
      { name: 'Zinger Deluxe', price: 450, category: 'Burgers', image: 'https://images.unsplash.com/photo-1513185158878-8d8c196b3c6c?q=80&w=2070&auto=format&fit=crop', desc: 'Crispy chicken fillet with lettuce and mayo.' },
      { name: 'Beef Smash Burger', price: 550, category: 'Burgers', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop', desc: 'Smashed beef patty with caramelized onions.' },
      { name: 'Loaded Fries', price: 300, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=2070&auto=format&fit=crop', desc: 'Fries topped with cheese sauce, jalapeños, and chicken chunks.' },
      { name: 'Onion Rings', price: 200, category: 'Sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=1974&auto=format&fit=crop', desc: 'Golden crispy fried onion rings.' },
      { name: 'Chocolate Shake', price: 350, category: 'Drinks', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1974&auto=format&fit=crop', desc: 'Thick and creamy chocolate milkshake.' }
    ]
  },
  {
    user: { name: 'China Town', email: 'goldendragon@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03002223334' },
    restaurant: { 
      name: 'Golden Dragon', 
      cuisine: 'Chinese, Asian, Soup', 
      address: 'Railway Road, Sahiwal', 
      deliveryFee: 80, 
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1512058560366-cd2427ffaa3a?q=80&w=1937&auto=format&fit=crop'
    },
    menu: [
      { name: 'Chicken Manchurian', price: 750, category: 'Chinese', image: 'https://images.unsplash.com/photo-1512058560366-cd2427ffaa3a?q=80&w=1937&auto=format&fit=crop', desc: 'Sweet and sour chicken with green chilies and onions.' },
      { name: 'Kung Pao Chicken', price: 850, category: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=2070&auto=format&fit=crop', desc: 'Spicy stir-fry chicken with peanuts and vegetables.' },
      { name: 'Egg Fried Rice', price: 500, category: 'Chinese', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=2024&auto=format&fit=crop', desc: 'Classic stir-fried rice with eggs and spring onions.' },
      { name: 'Chicken Chow Mein', price: 650, category: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1984&auto=format&fit=crop', desc: 'Stir-fried noodles with chicken and mixed vegetables.' },
      { name: 'Hot & Sour Soup', price: 400, category: 'Chinese', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop', desc: 'Spicy and tangy soup with chicken and bamboo shoots.' },
      { name: 'Spring Rolls (4 pcs)', price: 300, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1606525437679-037aca74a3e9?q=80&w=2070&auto=format&fit=crop', desc: 'Crispy vegetable spring rolls.' }
    ]
  },
  {
    user: { name: 'Sweet Tooth', email: 'sweettooth@shopeedo.com', password: 'password123', role: 'vendor', isApproved: true, phone: '03005556667' },
    restaurant: { 
      name: 'Sweet Tooth', 
      cuisine: 'Desserts, Ice Cream, Cakes', 
      address: 'Market Area, Sahiwal', 
      deliveryFee: 60, 
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1989&auto=format&fit=crop'
    },
    menu: [
      { name: 'Chocolate Fudge Cake', price: 1500, category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1989&auto=format&fit=crop', desc: 'Rich and moist chocolate cake with fudge icing.' },
      { name: 'Red Velvet Pastry', price: 250, category: 'Desserts', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=2028&auto=format&fit=crop', desc: 'Classic red velvet pastry with cream cheese frosting.' },
      { name: 'Vanilla Ice Cream (Large)', price: 400, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1570197788417-0e93323c33bd?q=80&w=2070&auto=format&fit=crop', desc: 'Premium vanilla ice cream made with real vanilla beans.' },
      { name: 'Kulfa Ice Cream', price: 450, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1934&auto=format&fit=crop', desc: 'Traditional desi kulfa flavored ice cream.' },
      { name: 'Gulab Jamun (1kg)', price: 800, category: 'Desserts', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=2071&auto=format&fit=crop', desc: 'Soft and spongy milk-based sweets in sugar syrup.' },
      { name: 'Rasmalai (2 pcs)', price: 300, category: 'Desserts', image: 'https://images.unsplash.com/photo-1605666807894-3c66f57f6f1c?q=80&w=2070&auto=format&fit=crop', desc: 'Cottage cheese patties in sweetened, thickened milk.' }
    ]
  }
];

const riders = [
  { name: 'Ali Rider', email: 'ali@shopeedo.com', password: 'password123', role: 'rider', isApproved: true, phone: '03009990001', vehicleType: 'Bike' },
  { name: 'Usman Rider', email: 'usman@shopeedo.com', password: 'password123', role: 'rider', isApproved: true, phone: '03009990002', vehicleType: 'Car' }
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
