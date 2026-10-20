const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema(
  {
    carName: {
      type: String,
      required: [true, "Car name is required"],
      trim: true,
    },
    brand: {
      type: String,
      default: "",
      trim: true,
    },
    model: {
      type: String,
      default: "",
      trim: true,
    },
    carType: {
      type: String,
      enum: ["hatchback", "sedan", "suv", "luxury"],
      default: "sedan",
    },
    carNumber: {
      type: String,
      required: [true, "Car number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    seats: {
      type: Number,
      default: 4,
      min: 2,
      max: 10,
    },
    pricePerKm: {
      type: Number,
      required: [true, "Price per km is required"],
      min: 0,
    },
    pricePerDay: {
      type: Number,
      default: 0,
    },
    carImage: {
      type: String,
      default: "",
    },
    driver: {
      type: String,
      default: "",
    },
    available: {
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

module.exports = mongoose.model("Car", CarSchema);