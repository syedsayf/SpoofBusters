const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    console.log("Pass protected")

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      // Get token from cookie
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized to access this route' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ 
          message: 'User no longer exists' 
        });
      }

      // Check if email is verified
      // if (!req.user.emailVerified) {
      //   return res.status(401).json({ 
      //     message: 'Please verify your email to access this route',
      //     isVerified: false
      //   });
      // }

      console.log("Pass protected")
      next();
    } catch (err) {
      console.log("failed protected", err)
      return res.status(401).json({ 
        message: 'Not authorized to access this route' 
      });
    }
  } catch (err) {
    next(err);
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
