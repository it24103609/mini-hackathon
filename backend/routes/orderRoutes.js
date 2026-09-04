const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All order routes require authentication
router.use(protect);

// POST /api/orders - Patient creates order
router.post("/", authorize("patient"), createOrder);

// GET /api/orders - View orders (role-filtered: Patient sees own, Pharmacist sees pharmacy orders, Admin sees all)
router.get("/", getOrders);

// GET /api/orders/:id - View single order
router.get("/:id", getOrderById);

// PUT /api/orders/:id/status - Update order status (Pharmacist or Admin)
router.put("/:id/status", authorize("pharmacist", "admin"), updateOrderStatus);

module.exports = router;
