const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: { type: String, default: 'Youstina Brand — About Us' },
  content: { type: String, default: '' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
