const Car = require("../models/Car");

// ==================== USER SIDE ====================

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().populate("driver", "name phone rating");
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableCars = async (req, res) => {
  try {
    const cars = await Car.find({ available: true }).populate(
      "driver",
      "name phone rating"
    );
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate(
      "driver",
      "name phone rating experience image"
    );
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCarsByType = async (req, res) => {
  try {
    const cars = await Car.find({ carType: req.params.type });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== ADMIN SIDE ====================

exports.addCar = async (req, res) => {
  try {
    const {
      carName,
      brand,
      model,
      carType,
      carNumber,
      seats,
      pricePerKm,
      pricePerDay,
    } = req.body;

    if (!carName || !carNumber || !pricePerKm) {
      return res.status(400).json({
        message: "Car name, number and price per km are required",
      });
    }

    const existingCar = await Car.findOne({ carNumber });
    if (existingCar) {
      return res.status(400).json({ message: "Car number already exists" });
    }

  
    const carImage = req.file ? req.file.path : "";

    const car = await Car.create({
      carName,
      brand: brand || "",
      model: model || "",
      carType: carType || "sedan",
      carNumber,
      seats: seats || 4,
      pricePerKm,
      pricePerDay: pricePerDay || 0,
      carImage,
    });

    res.status(201).json({
      message: "Car added successfully",
      car,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (req.file) {
      req.body.carImage = req.file.path;
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.toggleAvailability = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    car.available = !car.available;
    await car.save();

    res.status(200).json({
      message: `Car marked as ${car.available ? "available" : "unavailable"}`,
      car,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { driver: driverId },
      { new: true }
    ).populate("driver", "name phone");

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({
      message: "Driver assigned successfully",
      car,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};