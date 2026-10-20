const express = require("express");
const router = express.Router();
const {
  createPayment,
  getMyPayments,
  getAllPayments,
} = require("../controllers/paymentController");
const protect = require("../middlewares/authMiddleware");

router.post("/", protect, createPayment);
router.get("/my", protect, getMyPayments);
router.get("/all", protect, getAllPayments);

module.exports = router;