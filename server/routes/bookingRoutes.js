const express = require("express");
const router = express.Router();
const {
  bookRide,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  previewFare,
  calculateDistance, // ← ADD
} = require("../controllers/bookingController");

const protect = require("../middlewares/authMiddleware");

// ==================== USER ROUTES ====================

router.post("/calculate-distance", calculateDistance); 

router.post("/calculate-fare", protect, previewFare);

router.post("/", protect, bookRide);


router.get("/my", protect, getUserBookings);

// ==================== ADMIN ROUTES ====================


router.get("/all", protect, getAllBookings);


router.put("/status/:id", protect, updateBookingStatus);

// ==================== SHARED ROUTES (Dynamic — shevti thev!) ====================


router.get("/:id", protect, getBookingById);

router.put("/cancel/:id", protect, cancelBooking);

router.delete("/:id", protect, deleteBooking);

module.exports = router;