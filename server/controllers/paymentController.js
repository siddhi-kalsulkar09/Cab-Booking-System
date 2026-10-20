const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// ==================== CREATE PAYMENT (Fake Success) ====================
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;

    if (!bookingId || !amount || !method) {
      return res.status(400).json({ message: "All fields required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Fake transaction ID
    const transactionId =
      "TXN" + Date.now() + Math.floor(Math.random() * 1000);

    // Payment record — success status
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount,
      method,
      status: "success",
      transactionId,
    });

    // Booking update
    booking.paymentStatus = "paid";
    booking.payment = payment._id;
    await booking.save();

    res.status(201).json({
      message: "Payment successful ✅",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET MY PAYMENTS ====================
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("booking", "pickupLocation dropLocation fare status")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET ALL PAYMENTS (ADMIN) ====================
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email phone")
      .populate("booking", "pickupLocation dropLocation fare status")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};