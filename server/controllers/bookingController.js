const Booking = require("../models/Booking");
const Car = require("../models/Car");

// ==================== FARE CALCULATOR ====================
const calculateFare = (distance, pricePerKm, carType) => {
  const baseFare = 50;
  let fare = baseFare + distance * pricePerKm;

  if (carType === "luxury") fare *= 1.5;
  else if (carType === "suv") fare *= 1.2;

  return Math.round(fare);
};

// ==================== AUTO DISTANCE CALCULATOR ====================
exports.calculateDistance = async (req, res) => {
  try {
    const { pickup, drop } = req.body;

    if (!pickup || !drop) {
      return res.status(400).json({ message: "Pickup and drop required" });
    }

    // Get coordinates for pickup
    const pickupRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        pickup
      )}&limit=1`,
      {
        headers: {
          "User-Agent": "CabBookingApp/1.0 (contact@test.com)",
        },
      }
    );
    const pickupData = await pickupRes.json();

    if (!pickupData || pickupData.length === 0) {
      return res.status(404).json({ message: "Pickup location not found" });
    }

    // Get coordinates for drop
    const dropRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        drop
      )}&limit=1`,
      {
        headers: {
          "User-Agent": "CabBookingApp/1.0 (contact@test.com)",
        },
      }
    );
    const dropData = await dropRes.json();

    if (!dropData || dropData.length === 0) {
      return res.status(404).json({ message: "Drop location not found" });
    }

    const lat1 = parseFloat(pickupData[0].lat);
    const lon1 = parseFloat(pickupData[0].lon);
    const lat2 = parseFloat(dropData[0].lat);
    const lon2 = parseFloat(dropData[0].lon);

    // Haversine formula
    const R = 6371; // Earth radius km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    // Road distance approx = straight-line × 1.3
    distance = distance * 1.3;
    distance = Math.round(distance * 10) / 10; // 1 decimal

    res.status(200).json({
      distance,
      unit: "km",
    });
  } catch (error) {
    console.error("Distance error:", error);
    res.status(500).json({ message: "Distance calculation failed" });
  }
};

// ==================== USER SIDE ====================

exports.bookRide = async (req, res) => {
  try {
    const {
      carId,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      distance,
    } = req.body;

    if (
      !carId ||
      !pickupLocation ||
      !dropLocation ||
      !pickupDate ||
      !pickupTime
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    if (!car.available) {
      return res.status(400).json({ message: "Car not available" });
    }

    const dist = Number(distance) || 0;
    const fare = calculateFare(dist, car.pricePerKm, car.carType);

    const booking = await Booking.create({
      userId: req.user.id,
      carId,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      distance: dist,
      fare,
      status: "pending",
      paymentStatus: "unpaid",
      driver: "", // Initially no driver assigned
    });

    const populated = await Booking.findById(booking._id)
      .populate("carId", "carName carType carNumber pricePerKm carImage")
      .populate("userId", "name email phone");

    res.status(201).json({
      message: "Booking created successfully",
      booking: populated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("carId", "carName carType carNumber carImage pricePerKm")
      // .populate("driver", "name phone rating image")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("carId", "carName carType carNumber carImage pricePerKm")
      .populate("driver", "name phone rating image experience")
      .populate("userId", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        message: `Cannot cancel a ${booking.status} booking`,
      });
    }

    booking.status = "cancelled";
    booking.cancelledBy = "user";
    booking.cancelReason = req.body.reason || "";
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== ADMIN SIDE ====================

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email phone")
      .populate("carId", "carName carType carNumber")
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

    const validStatuses = [
      "pending",
      "accepted",
      "started",
      "completed",
      "cancelled",
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

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
      .populate("carId", "carName carType carNumber")
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

exports.previewFare = async (req, res) => {
  try {
    const { carId, distance } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const fare = calculateFare(
      Number(distance) || 0,
      car.pricePerKm,
      car.carType
    );

    res.status(200).json({
      distance: Number(distance) || 0,
      pricePerKm: car.pricePerKm,
      carType: car.carType,
      estimatedFare: fare,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};