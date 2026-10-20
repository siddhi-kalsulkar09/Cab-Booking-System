require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); 

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// ==================== STATIC FILES ====================
app.use("/uploads", express.static("uploads"));

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.json({ message: "🚗 Cab Booking System API is running..." });
});

// ==================== 404 HANDLER ====================
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// ==================== GLOBAL ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});