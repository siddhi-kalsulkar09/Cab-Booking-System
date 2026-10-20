const Admin = require("../models/Admin");
const User = require("../models/User");
const Car = require("../models/Car");
const Driver = require("../models/Driver");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==================== AUTH ====================
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role || "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== DASHBOARD ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalCars = await Car.countDocuments();
    const totalDrivers = await Driver.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });
    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });


    const payments = await Payment.find({ status: "success" });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      totalUsers,
      totalCars,
      totalDrivers,
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== USER MANAGEMENT ====================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== DRIVER MANAGEMENT ====================
exports.addDriver = async (req, res) => {
  try {
    const { name, email, phone, licenseNumber, experience, assignedCar } =
      req.body;

    if (!name || !email || !phone || !licenseNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Driver.findOne({
      $or: [{ email }, { licenseNumber }],
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Driver with this email/license already exists" });
    }

    const driver = await Driver.create({
      name,
      email,
      phone,
      licenseNumber,
      experience: experience || 0,
      assignedCar: assignedCar || null,
      image: req.file ? req.file.path : "",
    });

    if (assignedCar) {
      await Car.findByIdAndUpdate(assignedCar, { driver: driver._id });
    }

    res.status(201).json({
      message: "Driver added successfully",
      driver,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .populate("assignedCar", "carName carNumber carType")
      .sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      message: "Driver updated successfully",
      driver,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    await Car.updateMany(
      { driver: req.params.id },
      { $set: { driver: null } }
    );

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== BOOKING MANAGEMENT ====================

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email phone")
      .populate("carId", "carName carNumber carType")
      .populate("driver", "name phone")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, driverId } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status) booking.status = status;
    if (driverId) booking.driver = driverId;
    if (status === "completed") booking.completedAt = new Date();

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("userId", "name email phone")
      .populate("carId", "carName carNumber")
      .populate("driver", "name phone");

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== PAYMENT MANAGEMENT ====================

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

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (status === "success") {
      await Booking.findByIdAndUpdate(payment.booking, {
        paymentStatus: "paid",
      });
    } else if (status === "refunded") {
      await Booking.findByIdAndUpdate(payment.booking, {
        paymentStatus: "refunded",
      });
    }

    res.status(200).json({
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};