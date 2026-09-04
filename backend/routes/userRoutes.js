const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPharmacists,
  addPharmacistByAdmin,
  updatePharmacistStatus,
  deleteUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protect all routes below for Admin access only
router.use(protect, adminOnly);

router.get('/', getAllUsers);
router.get('/pharmacists', getPharmacists);
router.post('/pharmacist', addPharmacistByAdmin);
router.patch('/:id/status', updatePharmacistStatus);
router.delete('/:id', deleteUser);

module.exports = router;
