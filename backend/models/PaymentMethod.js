const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  cardholderName: { type: String, required: true },
  cardNumberMasked: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cardType: { type: String, default: 'Visa' },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
