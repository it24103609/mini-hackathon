const Order = require("../models/Order");
const Medicine = require("../models/Medicine");

// Helper function to update availability status from new quantity
const getAvailabilityStatus = (qty) => {
  if (qty > 10) return "Available";
  if (qty >= 1) return "Low Stock";
  return "Out of Stock";
};

// @desc    Create new medicine order / checkout
// @route   POST /api/orders
// @access  Private/Patient
const createOrder = async (req, res) => {
  try {
    const { items, pharmacyId } = req.body;

    // 1. Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided",
      });
    }

    if (!pharmacyId) {
      return res.status(400).json({
        success: false,
        message: "Pharmacy ID is required for the order",
      });
    }

    let calculatedTotal = 0;
    const verifiedItems = [];

    // 2. Validate items, stock availability, and calculate server-side total
    for (const item of items) {
      const medicineId = item.medicineId || item.medicine;
      const quantity = item.quantity;

      if (!medicineId || !quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Each item must have a valid medicineId and quantity >= 1",
        });
      }

      const medicine = await Medicine.findById(medicineId);
      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: `Medicine with ID ${medicineId} not found`,
        });
      }

      // Check stock availability
      if (medicine.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.medicineName}. Only ${medicine.quantity} remaining in stock.`,
        });
      }

      // Backend calculation using database price (do NOT trust frontend total)
      const itemPrice = medicine.price;
      const itemSubtotal = itemPrice * quantity;
      calculatedTotal += itemSubtotal;

      verifiedItems.push({
        medicine: medicine._id,
        quantity: Number(quantity),
        price: itemPrice,
      });

      // Deduct stock quantity and update availability
      medicine.quantity -= quantity;
      medicine.availability = getAvailabilityStatus(medicine.quantity);
      await medicine.save();
    }

    // 3. Create the order
    const order = await Order.create({
      patient: req.user._id,
      items: verifiedItems,
      totalAmount: calculatedTotal,
      pharmacy: pharmacyId,
      status: "Pending",
    });

    // Populate order details for the response
    const populatedOrder = await Order.findById(order._id)
      .populate("patient", "name email phone")
      .populate("pharmacy", "name shopName location phone address")
      .populate("items.medicine", "medicineName category imageUrl");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

// @desc    Get orders based on role:
//          - Patient: sees own orders
//          - Pharmacist: sees orders for their pharmacy
//          - Admin: monitors all orders
// @route   GET /api/orders
// @access  Private (Patient, Pharmacist, Admin)
const getOrders = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "patient") {
      filter.patient = req.user._id;
    } else if (req.user.role === "pharmacist") {
      filter.pharmacy = req.user._id;
    }
    // Admin has no filter -> views all orders

    const orders = await Order.find(filter)
      .populate("patient", "name email phone")
      .populate("pharmacy", "name shopName location phone address")
      .populate("items.medicine", "medicineName category imageUrl price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Patient owner, Pharmacist owner, or Admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("patient", "name email phone")
      .populate("pharmacy", "name shopName location phone address")
      .populate("items.medicine", "medicineName category imageUrl price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Role check: Patient can only view their own, Pharmacist can only view their pharmacy's, Admin can view all
    const isPatientOwner =
      req.user.role === "patient" &&
      order.patient._id.toString() === req.user._id.toString();
    const isPharmacyOwner =
      req.user.role === "pharmacist" &&
      order.pharmacy._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isPatientOwner && !isPharmacyOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
};

// @desc    Update order status (Pending -> Confirmed -> Completed or Cancelled)
// @route   PUT /api/orders/:id/status
// @access  Private (Pharmacist or Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Pharmacist can only update orders for their pharmacy; Admin can update any
    const isPharmacyOwner =
      req.user.role === "pharmacist" &&
      order.pharmacy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isPharmacyOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update status for this order",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
