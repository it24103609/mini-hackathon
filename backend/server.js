const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
const connectDB = require("./config/db");
connectDB();

// Initialize Express application
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Allows parsing JSON bodies in requests

// Basic Health / Test Route
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedFind LK Backend API is running successfully!",
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to MedFind LK API");
});

// Set port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
