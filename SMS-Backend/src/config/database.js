const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set in .env file');

    mongoose.set('strictQuery', true);

    await mongoose.connect(uri, {
      autoIndex: true, // automatically build indexes
    });

    console.log('[db] MongoDB connected successfully');
  } catch (error) {
    console.error('[db] MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
