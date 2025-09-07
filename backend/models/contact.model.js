const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
  name:{type:String, required:true, trim:true},
  email:{type:String, required:true, trim:true, lowercase:true},
  phone:{type:String, trim:true},
  category: { type: String, required: true, enum: ['complain','question'] },

  message:{type:String, required:true, trim:true},
  handled:{type:Boolean, default:false}
},{timestamps:true});
module.exports = mongoose.model('Contact',contactSchema);
