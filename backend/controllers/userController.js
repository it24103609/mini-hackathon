const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Get all users (Patients, Pharmacists, Admins)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

// @desc    Get all pharmacists (both pending, approved, rejected)
// @route   GET /api/users/pharmacists
// @access  Private/Admin
const getPharmacists = async (req, res) => {
  try {
    const pharmacists = await User.find({ role: "pharmacist" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pharmacists.length,
      pharmacists,
    });
  } catch (error) {
    console.error("Get Pharmacists Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch pharmacists",
    });
  }
};

// @desc    Admin manually add a pharmacist (auto approved by default)
// @route   POST /api/users/pharmacist
// @access  Private/Admin
const addPharmacist = async (req, res) => {
  try {
    const { name, email, password, shopName, location, phone, address } = req.body;

    if (!name || !email || !password || !shopName) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, and pharmacy/shop name",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Added directly by admin -> status is approved directly
    const pharmacist = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "pharmacist",
      status: "approved",
      shopName,
      location: location || "",
      phone: phone || "",
      address: address || "",
    });

    res.status(201).json({
      success: true,
      message: "Pharmacist added successfully and approved",
      pharmacist: {
        id: pharmacist._id,
        name: pharmacist.name,
        email: pharmacist.email,
        role: pharmacist.role,
        status: pharmacist.status,
        shopName: pharmacist.shopName,
        location: pharmacist.location,
        phone: pharmacist.phone,
      },
    });
  } catch (error) {
    console.error("Admin Add Pharmacist Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add pharmacist",
    });
  }
};

// @desc    Update pharmacist approval status (approved / rejected)
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
const updatePharmacistStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate allowed statuses
    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'approved' or 'rejected'",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "pharmacist") {
      return res.status(400).json({
        success: false,
        message: "Only pharmacist approval status can be updated via this endpoint",
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Pharmacist status successfully updated to ${status}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        shopName: user.shopName,
      },
    });
  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update pharmacist status",
    });
  }
};

// @desc    Delete user (Admin can delete users, but cannot edit user details)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves accidentally
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete their own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `User '${user.name}' (${user.role}) deleted successfully`,
    });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};

module.exports = {
  getAllUsers,
  getPharmacists,
  addPharmacist,
  updatePharmacistStatus,
  deleteUser,
};
