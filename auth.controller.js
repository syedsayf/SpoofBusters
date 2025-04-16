const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification - SpoofBusters',
        html: `
          <h1>Verify Your Email</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p>If you didn't create this account, please ignore this email.</p>
        `
      });

      sendTokenResponse(user, 201, res, 'Registration successful. Please check your email for verification.');
    } catch (err) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Email verification failed. Please try again.' });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        isVerified: false
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = user.getSignedJwtToken();
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Set email as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    res.status(200).json({ 
      success: true,
      message: 'Email verified successfully. You can now log in.' 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset - SpoofBusters',
        html: `
          <h1>Reset Your Password</h1>
          <p>You are receiving this email because you (or someone else) requested a password reset.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 10 minutes.</p>
        `
      });

      res.status(200).json({ 
        success: true, 
        message: 'Password reset email sent' 
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Password reset successful. You can now log in with your new password.' 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private

exports.getMe = async (req, res, next) => {
  try {
    // 1) Extract the token (from headers or cookies)
    let token;
    console.log('Entering getMe controller...', req.headers);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header:', token);
    } else if (req.cookies?.token) {
      token = req.cookies.token;
      console.log('Token found in cookies:', token);
    } else {
      console.log('No token found in headers or cookies');
    }

    if (!token) {
      console.log('No token provided → returning 401');
      return res.status(401).json({ 
        message: 'No token provided'
      });
    }

    // 2) Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token successfully verified. Decoded payload:', decoded);
    } catch (verifyError) {
      console.log('Failed to verify token. Error:', verifyError);
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    // 3) Lookup the user
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log(`No user found for ID: ${decoded.id}`);
      return res.status(404).json({
        message: 'User not found'
      });
    }

    console.log(`User found: ${user.username} (ID: ${user._id})`);

    // 4) Return the user data
    console.log('Sending back user data...');
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.log('Unexpected error in getMe:', err);
    // Typically 401 if token invalid or 500 if server error
    return res.status(401).json({ 
      message: 'Not authorized'
    });
  }
};


// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message = '') => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  };
  
  console.log(`Sending token cookie for user ${user.username} (ID: ${user._id}). Token: ${token}`);

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : null
      }
    });
};
