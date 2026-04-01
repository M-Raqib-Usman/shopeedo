const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  deliveryTime: String,
  deliveryFee: Number,
  image: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);