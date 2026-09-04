const express = require("express");
const router = express.Router();
const {
  getMedicines,
  getMedicineById,
  getMyMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

// GET /api/medicines - View all medicines (public / patients)
router.get("/", getMedicines);

// GET /api/medicines/my-medicines - Pharmacist view own medicines
router.get("/my-medicines", protect, authorize("pharmacist"), getMyMedicines);

// GET /api/medicines/:id - View single medicine details
router.get("/:id", getMedicineById);

// POST /api/medicines - Add medicine (Only approved pharmacists or admin)
// Handles photo upload via multer/cloudinary under field 'image'
router.post(
  "/",
  protect,
  authorize("pharmacist", "admin"),
  upload.single("image"),
  addMedicine
);

// PUT /api/medicines/:id - Edit medicine (Pharmacist owner or admin)
router.put(
  "/:id",
  protect,
  authorize("pharmacist", "admin"),
  upload.single("image"),
  updateMedicine
);

// DELETE /api/medicines/:id - Delete medicine (Pharmacist owner or admin)
router.delete(
  "/:id",
  protect,
  authorize("pharmacist", "admin"),
  deleteMedicine
);

module.exports = router;
