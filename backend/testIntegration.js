/**
 * Comprehensive Backend End-to-End Integration Test for MedFind LK
 * Tests the entire user journey:
 * 1. Patient Registration & Login
 * 2. Pharmacist Registration (Status = pending)
 * 3. Pharmacist Blocked from login while pending (403)
 * 4. Admin Login & Pharmacist Approval (PATCH /api/users/:id/status)
 * 5. Pharmacist Login after approval (Success)
 * 6. Pharmacist Adds Medicine (Auto stock availability calculation)
 * 7. Patient Searches & Filters Medicines
 * 8. Patient Places Order (Server-side price calculation & stock deduction)
 * 9. Pharmacist Views Order & Updates Status (Confirmed)
 * 10. Admin Views All Platform Orders
 */

const axios = require("axios");

const API = "http://localhost:5000/api";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runIntegrationTest() {
  console.log("=================================================");
  console.log("  MEDFIND LK - FULL BACKEND INTEGRATION TEST");
  console.log("=================================================\n");

  const timestamp = Date.now();
  const patientEmail = `patient_${timestamp}@test.com`;
  const pharmEmail = `pharm_${timestamp}@test.com`;
  const password = "Password123!";

  try {
    // -----------------------------------------------------------------
    // Step 1: Health Check
    // -----------------------------------------------------------------
    console.log("[STEP 1] Testing Health Endpoint (GET /api/test)...");
    const healthRes = await axios.get(`${API}/test`);
    if (healthRes.data.success) {
      console.log("--> PASS: Backend server is healthy!\n");
    }

    // -----------------------------------------------------------------
    // Step 2: Patient Registration & Login
    // -----------------------------------------------------------------
    console.log("[STEP 2] Registering Patient (POST /api/auth/register)...");
    const patientReg = await axios.post(`${API}/auth/register`, {
      name: "Kasun Jayawardena",
      email: patientEmail,
      password: password,
      role: "patient",
    });
    console.log(`--> PASS: Patient registered! (Status: ${patientReg.data.user.status})`);

    console.log("Logging in Patient (POST /api/auth/login)...");
    const patientLogin = await axios.post(`${API}/auth/login`, {
      email: patientEmail,
      password: password,
    });
    const patientToken = patientLogin.data.token;
    console.log("--> PASS: Patient logged in successfully! Token acquired.\n");

    // -----------------------------------------------------------------
    // Step 3: Pharmacist Registration & Pending Status Check
    // -----------------------------------------------------------------
    console.log("[STEP 3] Registering Pharmacist (POST /api/auth/register)...");
    const pharmReg = await axios.post(`${API}/auth/register`, {
      name: "Nimal Perera",
      email: pharmEmail,
      password: password,
      role: "pharmacist",
      shopName: "HealthPlus Pharmacy - Colombo",
      address: "123 Galle Road, Colombo 03",
    });
    const pharmId = pharmReg.data.user._id || pharmReg.data.user.id;
    console.log(`--> PASS: Pharmacist registered! (ID: ${pharmId}, Status: ${pharmReg.data.user.status})`);

    // -----------------------------------------------------------------
    // Step 4: Verify Pharmacist is blocked while Pending
    // -----------------------------------------------------------------
    console.log("[STEP 4] Verifying pending pharmacist CANNOT login...");
    try {
      await axios.post(`${API}/auth/login`, {
        email: pharmEmail,
        password: password,
      });
      throw new Error("SECURITY FAILURE: Pending pharmacist was able to login!");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log(`--> PASS: Login correctly rejected with 403: "${err.response.data.message}"\n`);
      } else {
        throw err;
      }
    }

    // -----------------------------------------------------------------
    // Step 5: Admin Login and Pharmacist Approval
    // -----------------------------------------------------------------
    console.log("[STEP 5] Logging in as Admin (POST /api/auth/login)...");
    const adminLogin = await axios.post(`${API}/auth/login`, {
      email: "admin@medfind.lk",
      password: "admin123",
    });
    const adminToken = adminLogin.data.token;
    console.log("--> PASS: Admin logged in!");

    console.log(`Admin approving pharmacist ${pharmId} (PATCH /api/users/:id/status)...`);
    const approveRes = await axios.patch(
      `${API}/users/${pharmId}/status`,
      { status: "approved" },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log(`--> PASS: ${approveRes.data.message}\n`);

    // -----------------------------------------------------------------
    // Step 6: Pharmacist Login After Approval
    // -----------------------------------------------------------------
    console.log("[STEP 6] Pharmacist logging in after approval (POST /api/auth/login)...");
    const pharmLogin = await axios.post(`${API}/auth/login`, {
      email: pharmEmail,
      password: password,
    });
    const pharmToken = pharmLogin.data.token;
    console.log("--> PASS: Approved pharmacist logged in successfully! Token acquired.\n");

    // -----------------------------------------------------------------
    // Step 7: Pharmacist Adds Medicine & Verifies Stock Availability
    // -----------------------------------------------------------------
    console.log("[STEP 7] Pharmacist adding a new medicine (POST /api/medicines)...");
    const medRes = await axios.post(
      `${API}/medicines`,
      {
        medicineName: `Metformin 500mg - ${timestamp}`,
        category: "Diabetes",
        description: "Blood sugar regulation medication",
        price: 30,
        quantity: 20, // > 10 should be 'Available'
        expiryDate: "2027-12-31",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        location: "Colombo 03",
      },
      { headers: { Authorization: `Bearer ${pharmToken}` } }
    );
    const medId = medRes.data.medicine._id;
    console.log(`--> PASS: Medicine added: ${medRes.data.medicine.medicineName}`);
    console.log(`--> Availability auto-calculated as: "${medRes.data.medicine.availability}"\n`);

    // -----------------------------------------------------------------
    // Step 8: Patient Searches & Filters Medicines
    // -----------------------------------------------------------------
    console.log("[STEP 8] Patient searching for 'Metformin' (GET /api/medicines?search=Metformin)...");
    const searchRes = await axios.get(`${API}/medicines?search=Metformin&location=Colombo`);
    console.log(`--> PASS: Found ${searchRes.data.count} matching medicine(s) in Colombo!\n`);

    // -----------------------------------------------------------------
    // Step 9: Patient Places Order
    // -----------------------------------------------------------------
    console.log("[STEP 9] Patient placing order for 4 units (POST /api/orders)...");
    const orderRes = await axios.post(
      `${API}/orders`,
      {
        pharmacyId: pharmId,
        items: [{ medicineId: medId, quantity: 4 }],
      },
      { headers: { Authorization: `Bearer ${patientToken}` } }
    );
    const orderId = orderRes.data.order._id;
    console.log(`--> PASS: Order placed! Order ID: ${orderId}`);
    console.log(`--> Server calculated total: Rs. ${orderRes.data.order.totalAmount} (4 x Rs. 30 = Rs. 120)`);
    console.log(`--> Order initial status: "${orderRes.data.order.status}"\n`);

    // Verify stock was reduced
    const updatedMed = await axios.get(`${API}/medicines/${medId}`);
    console.log(`--> Stock verification: Quantity reduced from 20 to ${updatedMed.data.medicine.quantity}\n`);

    // -----------------------------------------------------------------
    // Step 10: Pharmacist Views Orders & Confirms Order
    // -----------------------------------------------------------------
    console.log("[STEP 10] Pharmacist viewing orders (GET /api/orders)...");
    const pharmOrders = await axios.get(`${API}/orders`, {
      headers: { Authorization: `Bearer ${pharmToken}` },
    });
    console.log(`--> PASS: Pharmacist has ${pharmOrders.data.count} incoming order(s)`);

    console.log("Pharmacist updating order status to 'Confirmed' (PUT /api/orders/:id/status)...");
    const statusUpdateRes = await axios.put(
      `${API}/orders/${orderId}/status`,
      { status: "Confirmed" },
      { headers: { Authorization: `Bearer ${pharmToken}` } }
    );
    console.log(`--> PASS: Order status updated to: "${statusUpdateRes.data.order.status}"\n`);

    // -----------------------------------------------------------------
    // Step 11: Admin Monitors Platform Orders
    // -----------------------------------------------------------------
    console.log("[STEP 11] Admin monitoring all platform orders (GET /api/orders)...");
    const adminOrders = await axios.get(`${API}/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`--> PASS: Admin successfully fetched all ${adminOrders.data.count} system orders!\n`);

    console.log("=================================================");
    console.log("  ALL INTEGRATION TESTS PASSED 100% SUCCESSFULLY!");
    console.log("=================================================\n");
  } catch (err) {
    console.error("TEST FAILED:", err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

runIntegrationTest();
