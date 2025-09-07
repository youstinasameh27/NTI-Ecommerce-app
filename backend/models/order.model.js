const mongoose = require('mongoose');


const statuses = [
  'pending', 'placed',
  'preparing', 'processing',
  'ready-for-shipping',
  'shipped',
  'received', 'delivered',
  'paid', 
  'rejected', 'cancelled'
];

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    price: Number,
    qty: Number
  }],
  totals: {
    itemsTotal: Number,
    shipping: Number,
    grandTotal: Number,
    currency: { type: String, default: 'EGP' }
  },
  paymentMethod: { type: String, default: 'cash' }, // Cash only 
  shippingAddress: { line1: String, city: String, governorate: String, postalCode: String, phone: String },
  status: { type: String, enum: statuses, default: 'pending' },
  statusHistory: [{
    status: { type: String, enum: statuses },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String
  }],
  cancellation: { isCancelled: { type: Boolean, default: false }, reason: String, at: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
