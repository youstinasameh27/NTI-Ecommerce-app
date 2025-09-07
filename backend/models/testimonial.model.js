const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  orderId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating:    { type: Number, min: 1, max: 5, required: true },
  content:   { type: String, trim: true, default: '' },
  isApproved:{ type: Boolean, default: false },
  isSeenAt:  { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
