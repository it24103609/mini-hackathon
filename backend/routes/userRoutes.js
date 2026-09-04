const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getPharmacists,
  addPharmacist,
  updatePharmacistStatus,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All user management routes require:
// 1. Valid authentication (protect)
// 2. Admin role (authorize("admin"))
router.use(protect);
router.use(authorize("admin"));

// GET /api/users - Get all users
router.get("/", getAllUsers);

// GET /api/users/pharmacists - Get all pharmacists
router.get("/pharmacists", getPharmacists);

// POST /api/users/pharmacist - Admin directly add a pharmacist
router.post("/pharmacist", addPharmacist);

// PATCH /api/users/:id/status - Approve or reject pharmacist
router.patch("/:id/status", updatePharmacistStatus);

// DELETE /api/users/:id - Delete a user
// NOTE: No PUT /api/users/:id is created, enforcing rule: Admin can delete users, but cannot edit user details.
router.delete("/:id", deleteUser);

module.exports = router;
