const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'rider', 'admin'],
    default: 'customer'
  },
  address: String,
  password: String,           // We'll hash it later
  // Rider specific fields
  licenseNumber: String,
  cnic: String,
  vehicleType: String,
  documents: {
    licensePhoto: String,
    cnicPhoto: String
  },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true }, // Default true for customers
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);