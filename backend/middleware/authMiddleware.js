const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Authorization denied.'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided.'
    });
  }
};

// Admin only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required.'
    });
  }
};

// Pharmacist only access (must also be approved)
const pharmacistOnly = (req, res, next) => {
  if (req.user && req.user.role === 'pharmacist') {
    if (req.user.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Pharmacist account is not approved.'
      });
    }
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Approved Pharmacist role required.'
    });
  }
};

// Patient only access
const patientOnly = (req, res, next) => {
  if (req.user && req.user.role === 'patient') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Patient role required.'
    });
  }
};

module.exports = {
  protect,
  adminOnly,
  pharmacistOnly,
  patientOnly
};
