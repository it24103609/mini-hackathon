const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["patient", "pharmacist", "admin"],
      default: "patient",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        // Pharmacists start as pending, patients/admins start as approved
        return this.role === "pharmacist" ? "pending" : "approved";
      },
    },
    // Pharmacy-specific fields (used mainly when role is pharmacist)
    shopName: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
