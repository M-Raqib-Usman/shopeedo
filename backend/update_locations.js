const mongoose = require('mongoose');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopeedo';

const SAHIWAL_COORDS = {
  lat: 30.6682,
  lng: 73.1114
};

async function updateLocations() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update all Users (Customers, Vendors, Riders)
    const userResult = await User.updateMany(
      {},
      { 
        $set: { 
          location: SAHIWAL_COORDS,
          address: 'Sahiwal, Punjab, Pakistan'
        } 
      }
    );
    console.log(`✅ Updated ${userResult.modifiedCount} users to Sahiwal.`);

    // Update all Restaurants
    const restResult = await Restaurant.updateMany(
      {},
      { 
        $set: { 
          location: SAHIWAL_COORDS,
          address: 'Sahiwal, Punjab, Pakistan'
        } 
      }
    );
    console.log(`✅ Updated ${restResult.modifiedCount} restaurants to Sahiwal.`);

    console.log('Done! All locations updated to Sahiwal.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating locations:', error);
    process.exit(1);
  }
}

updateLocations();
