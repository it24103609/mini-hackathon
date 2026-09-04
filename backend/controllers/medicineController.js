const Medicine = require('../models/Medicine');

// @desc    Get all medicines (Search & Filter)
// @route   GET /api/medicines
// @access  Public
const getMedicines = async (req, res) => {
  try {
    const { search, category, location, availability } = req.query;
    let query = {};

    // Search by Medicine Name (case-insensitive)
    if (search) {
      query.medicineName = { $regex: search, $options: 'i' };
    }

    // Filter by Category
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Filter by Location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by Availability ('Available', 'Low Stock', 'Out of Stock')
    if (availability) {
      query.availability = availability;
    }

    const medicines = await Medicine.find(query)
      .populate('pharmacyId', 'name shopName location phone address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single medicine details
// @route   GET /api/medicines/:id
// @access  Public
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate(
      'pharmacyId',
      'name shopName location phone address'
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found.'
      });
    }

    res.status(200).json({
      success: true,
      medicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged-in pharmacist's own medicines
// @route   GET /api/medicines/my
// @access  Private/Pharmacist
const getMyMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ pharmacyId: req.user._id }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add new medicine (Approved Pharmacist)
// @route   POST /api/medicines
// @access  Private/Pharmacist
const addMedicine = async (req, res) => {
  try {
    const { medicineName, category, description, imageUrl, price, quantity, expiryDate, location } = req.body;

    if (!medicineName || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide medicineName, category, price, and quantity.'
      });
    }

    const medicine = new Medicine({
      medicineName,
      category,
      description: description || '',
      imageUrl: imageUrl || '',
      price: Number(price),
      quantity: Number(quantity),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      pharmacyId: req.user._id,
      location: location || req.user.location || ''
    });

    await medicine.save();

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully.',
      medicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update medicine (Owner Pharmacist or Admin)
// @route   PUT /api/medicines/:id
// @access  Private (Pharmacist or Admin)
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found.'
      });
    }

    // Check ownership: Must be the pharmacist who owns it, or Admin
    if (medicine.pharmacyId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this medicine.'
      });
    }

    const { medicineName, category, description, imageUrl, price, quantity, expiryDate, location } = req.body;

    if (medicineName !== undefined) medicine.medicineName = medicineName;
    if (category !== undefined) medicine.category = category;
    if (description !== undefined) medicine.description = description;
    if (imageUrl !== undefined) medicine.imageUrl = imageUrl;
    if (price !== undefined) medicine.price = Number(price);
    if (quantity !== undefined) medicine.quantity = Number(quantity);
    if (expiryDate !== undefined) medicine.expiryDate = new Date(expiryDate);
    if (location !== undefined) medicine.location = location;

    await medicine.save();

    res.status(200).json({
      success: true,
      message: 'Medicine updated successfully.',
      medicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete medicine (Owner Pharmacist or Admin)
// @route   DELETE /api/medicines/:id
// @access  Private (Pharmacist or Admin)
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found.'
      });
    }

    // Check ownership: Must be the pharmacist who owns it, or Admin
    if (medicine.pharmacyId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this medicine.'
      });
    }

    await Medicine.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  getMyMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine
};
