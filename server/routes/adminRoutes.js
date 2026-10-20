const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  addDriver,
  getAllDrivers,
  updateDriver,
  deleteDriver,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getAllPayments,
  updatePaymentStatus,
} = require("../controllers/adminController");

const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");

// ==================== AUTH (Public) ====================
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// ==================== DASHBOARD ====================
router.get("/stats", protect, getDashboardStats);
router.get("/dashboard", protect, getDashboardStats); // backup path

// ==================== USER MANAGEMENT ====================
router.get("/users", protect, getAllUsers);
router.delete("/users/:id", protect, deleteUser);

// ==================== DRIVER MANAGEMENT ====================
router.post("/drivers", protect, upload.single("image"), addDriver);
router.get("/drivers", protect, getAllDrivers);
router.put("/drivers/:id", protect, upload.single("image"), updateDriver);
router.delete("/drivers/:id", protect, deleteDriver);

// ==================== BOOKING MANAGEMENT ====================
router.get("/bookings", protect, getAllBookings);
router.put("/bookings/:id", protect, updateBookingStatus);
router.delete("/bookings/:id", protect, deleteBooking);

// ==================== PAYMENT MANAGEMENT ====================
router.get("/payments", protect, getAllPayments);
router.put("/payments/:id", protect, updatePaymentStatus);

module.exports = router;