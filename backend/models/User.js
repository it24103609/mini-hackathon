const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password']
    },
    role: {
      type: String,
      enum: ['patient', 'pharmacist', 'admin'],
      default: 'patient'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: function () {
        // Patients are auto-approved; Pharmacists default to pending approval by Admin
        return this.role === 'pharmacist' ? 'pending' : 'approved';
      }
    },
    // Pharmacist specific fields
    shopName: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
