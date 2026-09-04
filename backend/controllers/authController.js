const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Helper function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register a new user (Patient or Pharmacist)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, shopName, location, phone, address } =
      req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    // 3. Pharmacists need shop details
    if (role === "pharmacist" && !shopName) {
      return res.status(400).json({
        success: false,
        message: "Shop/Pharmacy name is required for pharmacist registration",
      });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Determine initial status:
    // Pharmacist starts as 'pending' (requires admin approval)
    // Patient starts as 'approved'
    const status = role === "pharmacist" ? "pending" : "approved";

    // 6. Create user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "patient",
      status,
      shopName: shopName || "",
      location: location || "",
      phone: phone || "",
      address: address || "",
    });

    // If pharmacist, let them know account is pending approval
    if (user.role === "pharmacist") {
      return res.status(201).json({
        success: true,
        message:
          "Pharmacist registration successful! Your account is pending admin approval before you can log in.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          shopName: user.shopName,
        },
      });
    }

    // If patient, return user data + token immediately
    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error during registration",
    });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Pharmacist Approval Workflow Check:
    // If pharmacist is still 'pending'
    if (user.role === "pharmacist" && user.status === "pending") {
      return res.status(403).json({
        success: false,
        message:
          "Your pharmacist account is still pending admin approval. Please wait for an administrator to approve your registration.",
      });
    }

    // If pharmacist is 'rejected'
    if (user.role === "pharmacist" && user.status === "rejected") {
      return res.status(403).json({
        success: false,
        message:
          "Your pharmacist account registration has been rejected. Please contact administration.",
      });
    }

    // 5. Generate token & return user info
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        shopName: user.shopName,
        location: user.location,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error during login",
    });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (protect)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error fetching profile",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
