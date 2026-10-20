const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middlewares/authMiddleware");

// ==================== AUTH (Public) ====================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ==================== USER PROFILE ====================

// Get own profile
router.get("/profile/:id", protect, getUserProfile);

// Update own profile
router.put("/profile/:id", protect, updateUserProfile);

// Change password
router.put("/change-password/:id", protect, changePassword);

// ==================== ADMIN ROUTES ====================

router.get("/", protect, getAllUsers);
router.delete("/:id", protect, deleteUser);

module.exports = router;