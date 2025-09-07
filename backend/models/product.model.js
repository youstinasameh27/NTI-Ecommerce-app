// backend/models/Product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OptionValueSchema = new Schema({
  value: { type: String, required: true }
}, { _id: false });

const OptionSchema = new Schema({
  name: { type: String, required: true },            // Size, Color
  values: [{ type: String }]                         // 36,37,38 or Red,Blue
}, { _id: false });

const VariantSchema = new Schema({
  key: { type: String, required: true },             // Size:36|Color:Black
  values: [{ name: String, value: String }],         // {name: "Size", value: "36"}
  price: { type: Number },                           
  stock: { type: Number, default: 0 },
  sku: { type: String }                              
}, { timestamps: true });

const ProductSchema = new Schema({
  title: { type: String, required: true },
  route: { type: String, required: true, unique: true },
  desc: { type: String },
  price: { type: Number, required: true },
  imgURL: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  options: [OptionSchema],
  variants: [VariantSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
