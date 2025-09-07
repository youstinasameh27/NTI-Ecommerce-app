const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('mongo connected');
  } catch (err) {
    console.error('db error', err);
    process.exit(1);
  }
};

module.exports = connectDB;
