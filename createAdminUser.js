// createAdminUser.js
const mongoose = require('mongoose');
const User = require('../src/models/User'); // adjust if needed

const MONGO_URI = 'mongodb://localhost:27017/spoofbusters';

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const newUser = new User({
      username: 'Admin',
      email: 'admin@spoofbusters.com',
      password: '123456', // plain password (let Mongoose hash it!)
      role: 'admin',
      emailVerified: true,
      createdAt: new Date()
    });

    await newUser.save();
    console.log('🎉 Admin user created successfully!');

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
    mongoose.disconnect();
  }
};

run();
