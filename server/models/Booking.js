const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    driver: {
      type: String,
      default: "",
    },

    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
      trim: true,
    },
    dropLocation: {
      type: String,
      required: [true, "Drop location is required"],
      trim: true,
    },

    pickupDate: {
      type: Date,
      required: [true, "Pickup date is required"],
    },
    pickupTime: {
      type: String,
      required: [true, "Pickup time is required"],
    },

    distance: {
      type: Number,
      default: 0, 
    },
    fare: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "started", "completed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    cancelledBy: {
      type: String,
      enum: ["user", "admin", "driver", null],
      default: null,
    },
    cancelReason: {
      type: String,
      default: "",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);