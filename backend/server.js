const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check / Test Route
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MedFind LK Backend API is running smoothly!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to MedFind LK API");
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


