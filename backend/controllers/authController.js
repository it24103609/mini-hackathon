const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Patient or Pharmacist)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, shopName, location, phone, address } = req.body;

    // Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine status (Pharmacists start as pending, Patients as approved)
    const userRole = role === 'pharmacist' ? 'pharmacist' : 'patient';
    const status = userRole === 'pharmacist' ? 'pending' : 'approved';

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      status,
      shopName: shopName || '',
      location: location || '',
      phone: phone || '',
      address: address || ''
    });

    if (user) {
      // If pharmacist, notify that admin approval is required
      if (user.role === 'pharmacist') {
        return res.status(201).json({
          success: true,
          message: 'Pharmacist registered successfully. Account is pending admin approval.',
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            shopName: user.shopName
          }
        });
      }

      // If patient, return JWT token immediately
      return res.status(201).json({
        success: true,
        message: 'Patient registered successfully.',
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Pharmacist Approval Check
    if (user.role === 'pharmacist') {
      if (user.status === 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Your pharmacist account is pending approval by Admin. You cannot login yet.'
        });
      }
      if (user.status === 'rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your pharmacist account registration has been rejected by Admin.'
        });
      }
    }

    // Login successful
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        shopName: user.shopName,
        location: user.location,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
