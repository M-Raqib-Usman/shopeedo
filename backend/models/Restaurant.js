const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  ratingCount: { type: Number, default: 1 },
  deliveryTime: String,
  deliveryFee: Number,
  image: String,
  logo: String,               // Restaurant Logo
  address: String,            // Physical Address
  location: {                 // GPS Coordinates
    lat: { type: Number },
    lng: { type: Number }
  },
  contactInfo: String,        // Phone/Email for restaurant
  vendorEmail: { type: String, default: null },
  isApproved: { type: Boolean, default: false },
  menu: [{
    id: String,
    name: String,
    price: Number,
    desc: String,
    image: String
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);