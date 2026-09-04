const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Pharmacy reference is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    availability: {
      type: String,
      enum: ["Available", "Low Stock", "Out of Stock"],
      default: "Out of Stock",
    },
  },
  {
    timestamps: true,
  }
);

// Helper / pre-save hook to calculate availability based on quantity:
// quantity > 10 => Available
// quantity 1–10 => Low Stock
// quantity = 0 => Out of Stock
medicineSchema.pre("save", function (next) {
  if (this.quantity > 10) {
    this.availability = "Available";
  } else if (this.quantity >= 1) {
    this.availability = "Low Stock";
  } else {
    this.availability = "Out of Stock";
  }
  next();
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
