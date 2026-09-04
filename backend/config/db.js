const mongoose = require('mongoose');
const dns = require('dns');

// Use public DNS to resolve MongoDB Atlas SRV records reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback if system restricts changing DNS
}
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`Please verify MONGO_URI in backend/.env and ensure your cluster is active & network access (0.0.0.0/0) is allowed.`);
  }
};

module.exports = connectDB;


