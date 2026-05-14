const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userEmail: {                    // ← Main field for linking orders to user
    type: String,
    required: true,
    index: true                     // For faster queries
  },
  riderEmail: {                   // ← Field for linking orders to a rider
    type: String,
    default: null
  },
  deliveryLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  pickupLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  riderLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    restaurantId: { type: String, required: true },
    restaurantEmail: { type: String } // Needed for vendor dashboard
  }],
  address: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);