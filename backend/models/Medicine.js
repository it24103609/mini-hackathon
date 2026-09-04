const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: [true, 'Please provide medicine name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide medicine category'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: 0
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: 0,
      default: 0
    },
    expiryDate: {
      type: Date
    },
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      type: String,
      default: ''
    },
    availability: {
      type: String,
      enum: ['Available', 'Low Stock', 'Out of Stock'],
      default: 'Out of Stock'
    }
  },
  {
    timestamps: true
  }
);

// Auto-calculate availability based on quantity before saving
medicineSchema.pre('save', function () {
  if (this.quantity > 10) {
    this.availability = 'Available';
  } else if (this.quantity >= 1) {
    this.availability = 'Low Stock';
  } else {
    this.availability = 'Out of Stock';
  }
});

module.exports = mongoose.model('Medicine', medicineSchema);
