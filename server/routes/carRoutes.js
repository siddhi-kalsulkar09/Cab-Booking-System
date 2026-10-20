const express = require("express");
const router = express.Router();
const {
  getAllCars,
  getAvailableCars,
  getCarById,
  getCarsByType,
  addCar,
  updateCar,
  deleteCar,
  toggleAvailability,
  assignDriver,
} = require("../controllers/carController");

const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");

// ==================== PUBLIC / USER ROUTES ====================

router.get("/", getAllCars);

router.get("/available", getAvailableCars);

router.get("/type/:type", getCarsByType);

// ==================== ADMIN ROUTES ====================

router.post("/", protect, upload.single("carImage"), addCar);

router.put("/toggle/:id", protect, toggleAvailability);

router.put("/assign-driver/:id", protect, assignDriver);

router.put("/:id", protect, upload.single("carImage"), updateCar);

router.delete("/:id", protect, deleteCar);

// ==================== DYNAMIC ROUTE (SHEVTI THEV!) ====================

router.get("/:id", getCarById);

module.exports = router;