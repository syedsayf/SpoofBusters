// scripts/generateToken.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'superSecretKey123';

const token = jwt.sign(
  { id: '67f4918478c897454828b4e0' },  // Use your admin user _id
  JWT_SECRET,
  { expiresIn: '30d' }
);

console.log('✅ Your new token:\n', token);
