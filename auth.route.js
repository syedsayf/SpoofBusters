const express = require('express');
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
