const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Driver name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    assignedCar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", DriverSchema);