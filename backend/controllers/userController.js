const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Get all users (Patients, Pharmacists, Admins)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all pharmacists (Pending, Approved, Rejected)
// @route   GET /api/users/pharmacists
// @access  Private/Admin
const getPharmacists = async (req, res) => {
  try {
    const pharmacists = await User.find({ role: 'pharmacist' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: pharmacists.length,
      pharmacists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Admin add a pharmacist (Directly created, defaults to approved or custom status)
// @route   POST /api/users/pharmacist
// @access  Private/Admin
const addPharmacistByAdmin = async (req, res) => {
  try {
    const { name, email, password, shopName, location, phone, address, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const pharmacist = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'pharmacist',
      status: status || 'approved', // Default to approved when Admin adds them directly
      shopName: shopName || '',
      location: location || '',
      phone: phone || '',
      address: address || ''
    });

    res.status(201).json({
      success: true,
      message: 'Pharmacist created successfully by Admin.',
      pharmacist: {
        _id: pharmacist._id,
        name: pharmacist.name,
        email: pharmacist.email,
        role: pharmacist.role,
        status: pharmacist.status,
        shopName: pharmacist.shopName,
        location: pharmacist.location,
        phone: pharmacist.phone,
        address: pharmacist.address
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve or Reject a pharmacist registration
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
const updatePharmacistStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "approved", "rejected", or "pending".'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Pharmacist status updated to ${status}.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Prevent admin from deleting themselves accidentally
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own account.'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getPharmacists,
  addPharmacistByAdmin,
  updatePharmacistStatus,
  deleteUser
};
