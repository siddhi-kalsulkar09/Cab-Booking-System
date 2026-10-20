require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Car = require("./models/Car");

const sampleCars = [
  {
    carName: "Swift Dzire",
    brand: "Maruti",
    model: "2023",
    carType: "sedan",
    carNumber: "MH12AB1234",
    seats: 4,
    pricePerKm: 12,
    pricePerDay: 800,
    available: true,
    rating: 4.5,
  },
  {
    carName: "Honda City",
    brand: "Honda",
    model: "2023",
    carType: "sedan",
    carNumber: "MH12CD5678",
    seats: 4,
    pricePerKm: 14,
    pricePerDay: 950,
    available: true,
    rating: 4.7,
  },
  {
    carName: "Maruti Swift",
    brand: "Maruti",
    model: "2023",
    carType: "hatchback",
    carNumber: "MH12EF9012",
    seats: 4,
    pricePerKm: 10,
    pricePerDay: 650,
    available: true,
    rating: 4.3,
  },
  {
    carName: "Hyundai i20",
    brand: "Hyundai",
    model: "2023",
    carType: "hatchback",
    carNumber: "MH12GH3456",
    seats: 4,
    pricePerKm: 11,
    pricePerDay: 700,
    available: true,
    rating: 4.4,
  },
  {
    carName: "Toyota Innova",
    brand: "Toyota",
    model: "2023",
    carType: "suv",
    carNumber: "MH12IJ7890",
    seats: 7,
    pricePerKm: 18,
    pricePerDay: 1500,
    available: true,
    rating: 4.8,
  },
  {
    carName: "Mahindra XUV700",
    brand: "Mahindra",
    model: "2023",
    carType: "suv",
    carNumber: "MH12KL2345",
    seats: 7,
    pricePerKm: 20,
    pricePerDay: 1800,
    available: true,
    rating: 4.6,
  },
  {
    carName: "BMW 5 Series",
    brand: "BMW",
    model: "2023",
    carType: "luxury",
    carNumber: "MH12MN6789",
    seats: 4,
    pricePerKm: 45,
    pricePerDay: 5000,
    available: true,
    rating: 5.0,
  },
  {
    carName: "Mercedes E-Class",
    brand: "Mercedes",
    model: "2023",
    carType: "luxury",
    carNumber: "MH12OP1234",
    seats: 4,
    pricePerKm: 50,
    pricePerDay: 6000,
    available: true,
    rating: 5.0,
  },
  {
    carName: "Tata Nexon",
    brand: "Tata",
    model: "2023",
    carType: "suv",
    carNumber: "MH12QR5678",
    seats: 5,
    pricePerKm: 15,
    pricePerDay: 1200,
    available: true,
    rating: 4.5,
  },
  {
    carName: "Maruti Ertiga",
    brand: "Maruti",
    model: "2023",
    carType: "suv",
    carNumber: "MH12ST9012",
    seats: 7,
    pricePerKm: 16,
    pricePerDay: 1300,
    available: true,
    rating: 4.4,
  },
];

const seedCars = async () => {
  try {
    await connectDB();

    await Car.deleteMany({});
    console.log("🗑️  Purani cars delete kelya");

    const cars = await Car.insertMany(sampleCars);
    console.log(`✅ ${cars.length} cars add zhale!`);

    console.log("\n📋 Added cars:");
    cars.forEach((car, i) => {
      console.log(`  ${i + 1}. ${car.carName} (${car.carType}) — ₹${car.pricePerKm}/km`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedCars();