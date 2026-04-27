const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const verifyAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const result = await User.updateMany({}, { isVerified: true });
    console.log(`Updated ${result.modifiedCount} users to isVerified: true`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

verifyAll();
