const Order = require('../models/Order');
const Medicine = require('../models/Medicine');

// @desc    Create a new order (Patient)
// @route   POST /api/orders
// @access  Private/Patient
const createOrder = async (req, res) => {
  try {
    const { items, pharmacyId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required.'
      });
    }

    let calculatedTotal = 0;
    const validatedItems = [];
    let detectedPharmacyId = pharmacyId;

    // Validate each item and calculate total on backend
    for (const item of items) {
      const medicineDoc = await Medicine.findById(item.medicine);

      if (!medicineDoc) {
        return res.status(404).json({
          success: false,
          message: `Medicine not found for ID: ${item.medicine}`
        });
      }

      // Stock validation
      if (medicineDoc.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicineDoc.medicineName}. Requested: ${item.quantity}, Available: ${medicineDoc.quantity}`
        });
      }

      // Accumulate item price * quantity
      const itemPrice = medicineDoc.price;
      calculatedTotal += itemPrice * item.quantity;

      validatedItems.push({
        medicine: medicineDoc._id,
        quantity: item.quantity,
        price: itemPrice
      });

      // Track pharmacy if not explicitly provided
      if (!detectedPharmacyId) {
        detectedPharmacyId = medicineDoc.pharmacyId;
      }
    }

    // Deduct stock quantity for each ordered medicine
    for (const item of items) {
      const medicineDoc = await Medicine.findById(item.medicine);
      medicineDoc.quantity -= item.quantity;
      await medicineDoc.save(); // pre-save hook recalculates availability
    }

    // Create Order
    const order = await Order.create({
      patient: req.user._id,
      items: validatedItems,
      totalAmount: calculatedTotal,
      pharmacy: detectedPharmacyId,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get orders (Patient gets own orders, Pharmacist gets pharmacy orders, Admin gets all)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'pharmacist') {
      query.pharmacy = req.user._id;
    }
    // Admin sees all orders (query remains empty)

    const orders = await Order.find(query)
      .populate('patient', 'name email phone address')
      .populate('pharmacy', 'name shopName location phone')
      .populate('items.medicine', 'medicineName category imageUrl price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('patient', 'name email phone address')
      .populate('pharmacy', 'name shopName location phone')
      .populate('items.medicine', 'medicineName category imageUrl price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Authorization check: Patient owns order, Pharmacist owns order pharmacy, or Admin
    const isPatientOwner = order.patient._id.toString() === req.user._id.toString();
    const isPharmacyOwner = order.pharmacy && order.pharmacy._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatientOwner && !isPharmacyOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order.'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Pharmacist, Admin, or Patient for cancellation)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be Pending, Confirmed, Completed, or Cancelled.'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // If cancelling, restock medicine quantities
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        const medicineDoc = await Medicine.findById(item.medicine);
        if (medicineDoc) {
          medicineDoc.quantity += item.quantity;
          await medicineDoc.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}.`,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
