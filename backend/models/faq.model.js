const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
  enabled:  { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Faq', faqSchema);
