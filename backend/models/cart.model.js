const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId:  { type: mongoose.Schema.Types.ObjectId, default: null },
  variantKey: String,
  title:      String,
  price:      Number,
  qty:        { type: Number, default: 1, min: 1 },
  priceAtAdd: Number
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true, default: null },
  sessionId: { type: String, index: true, sparse: true, default: null },
  items:     [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
