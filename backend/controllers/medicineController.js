const Medicine = require("../models/Medicine");

// Helper function to calculate availability from quantity
const calculateAvailability = (quantity) => {
  const qty = Number(quantity);
  if (qty > 10) return "Available";
  if (qty >= 1) return "Low Stock";
  return "Out of Stock";
};

// @desc    Get all medicines (supports filtering/search - used in Phase 6 too)
// @route   GET /api/medicines
// @access  Public
const getMedicines = async (req, res) => {
  try {
    const { search, category, location, availability } = req.query;
    let query = {};

    // Search by medicine name (case-insensitive regex)
    if (search) {
      query.medicineName = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by availability (Available, Low Stock, Out of Stock)
    if (availability) {
      query.availability = availability;
    }

    const medicines = await Medicine.find(query)
      .populate("pharmacyId", "name shopName location phone address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    console.error("Get Medicines Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch medicines",
    });
  }
};

// @desc    Get single medicine details
// @route   GET /api/medicines/:id
// @access  Public
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate(
      "pharmacyId",
      "name shopName location phone address email"
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      medicine,
    });
  } catch (error) {
    console.error("Get Medicine By ID Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch medicine details",
    });
  }
};

// @desc    Get medicines added by logged-in pharmacist
// @route   GET /api/medicines/my-medicines
// @access  Private/Pharmacist
const getMyMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ pharmacyId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    console.error("Get My Medicines Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch your medicines",
    });
  }
};

// @desc    Add a new medicine (with photo upload)
// @route   POST /api/medicines
// @access  Private (Approved Pharmacist or Admin)
const addMedicine = async (req, res) => {
  try {
    const { medicineName, category, description, price, quantity, expiryDate, location } =
      req.body;

    // Validation
    if (!medicineName || !category || price === undefined || quantity === undefined || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide medicine name, category, price, quantity, and expiry date",
      });
    }

    // Cloudinary image URL if uploaded via Multer, or direct imageUrl string in body
    let imageUrl = "";
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const numQty = Number(quantity);
    const numPrice = Number(price);

    // Pharmacist's shop location or user provided location
    const medLocation = location || req.user.location || req.user.shopName || "Colombo";

    const medicine = await Medicine.create({
      medicineName,
      category,
      description: description || "",
      imageUrl,
      price: numPrice,
      quantity: numQty,
      expiryDate,
      pharmacyId: req.user._id,
      location: medLocation,
      availability: calculateAvailability(numQty),
    });

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      medicine,
    });
  } catch (error) {
    console.error("Add Medicine Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add medicine",
    });
  }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private (Pharmacist owner or Admin)
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    let medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // Ownership check: Only owner pharmacist or admin can update
    const isOwner = medicine.pharmacyId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this medicine",
      });
    }

    const {
      medicineName,
      category,
      description,
      price,
      quantity,
      expiryDate,
      location,
      imageUrl,
    } = req.body;

    if (medicineName) medicine.medicineName = medicineName;
    if (category) medicine.category = category;
    if (description !== undefined) medicine.description = description;
    if (location) medicine.location = location;
    if (expiryDate) medicine.expiryDate = expiryDate;

    if (price !== undefined) {
      medicine.price = Number(price);
    }

    if (quantity !== undefined) {
      medicine.quantity = Number(quantity);
      medicine.availability = calculateAvailability(medicine.quantity);
    }

    // If a new photo is uploaded, update imageUrl. Otherwise keep existing photo.
    if (req.file && req.file.path) {
      medicine.imageUrl = req.file.path;
    } else if (imageUrl) {
      medicine.imageUrl = imageUrl;
    }

    await medicine.save();

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      medicine,
    });
  } catch (error) {
    console.error("Update Medicine Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update medicine",
    });
  }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private (Pharmacist owner or Admin)
const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // Ownership check: Only owner pharmacist or admin can delete
    const isOwner = medicine.pharmacyId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this medicine",
      });
    }

    await Medicine.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.error("Delete Medicine Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete medicine",
    });
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  getMyMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
};
