const express = require('express');
const router = express.Router();
const {
  getMedicines,
  getMedicineById,
  getMyMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine
} = require('../controllers/medicineController');
const { protect, pharmacistOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getMedicines);

// Pharmacist own medicines
router.get('/my', protect, pharmacistOnly, getMyMedicines);

// Public single medicine detail
router.get('/:id', getMedicineById);

// Protected routes (Pharmacists / Admin)
router.post('/', protect, pharmacistOnly, addMedicine);
router.put('/:id', protect, updateMedicine);
router.delete('/:id', protect, deleteMedicine);

module.exports = router;
