import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../utils/constants";

function BookRide() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState(0);

  const [form, setForm] = useState({
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    pickupTime: "",
    distance: "",
  });

  // ==================== FETCH CAR DETAILS ====================
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/cars/${id}`);
        setCar(res.data);
      } catch (error) {
        console.error(error);
        alert("Car not found");
        navigate("/cabs");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  // ==================== LIVE FARE CALCULATION ====================
  useEffect(() => {
    if (!car || !form.distance) {
      setEstimatedFare(0);
      return;
    }

    const baseFare = 50;
    let fare = baseFare + Number(form.distance) * car.pricePerKm;

    if (car.carType === "luxury") fare *= 1.5;
    else if (car.carType === "suv") fare *= 1.2;

    setEstimatedFare(Math.round(fare));
  }, [form.distance, car]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ==================== SUBMIT BOOKING ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE_URL}/bookings`,
        {
          carId: id,
          pickupLocation: form.pickupLocation,
          dropLocation: form.dropLocation,
          pickupDate: form.pickupDate,
          pickupTime: form.pickupTime,
          distance: Number(form.distance) || 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Booking Successful 🚗");
      navigate("/mybookings");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Booking Failed ❌");
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "60px", textAlign: "center" }}>
          Loading car details...
        </div>
      </>
    );
  }

  if (!car) return null;

  // ==================== UI ====================
  return (
    <>
      <Navbar />

      <div className="page-container" style={{ padding: "40px 20px" }}>
        <div
          className="card"
          style={{
            width: "500px",
            margin: "auto",
            background: "#fff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Book Your Ride 🚗</h2>

          {/* Car info summary */}
          <div
            style={{
              background: "#f9f9f9",
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <p style={{ margin: "4px 0" }}>
              <strong>Car:</strong> {car.carName} ({car.carType})
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Number:</strong> {car.carNumber}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Rate:</strong> ₹{car.pricePerKm}/km
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Seats:</strong> {car.seats}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              name="pickupLocation"
              placeholder="Pickup Location"
              value={form.pickupLocation}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              className="auth-input"
              name="dropLocation"
              placeholder="Drop Location"
              value={form.dropLocation}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="pickupDate"
              type="date"
              value={form.pickupDate}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="pickupTime"
              type="time"
              value={form.pickupTime}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="distance"
              type="number"
              placeholder="Estimated Distance (km)"
              value={form.distance}
              onChange={handleChange}
              min="1"
              required
              style={inputStyle}
            />

            {estimatedFare > 0 && (
              <div
                style={{
                  background: "#e8f5e9",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                <strong>Estimated Fare: </strong>
                <span
                  style={{
                    color: "#2e7d32",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  ₹{estimatedFare}
                </span>
              </div>
            )}

            <button
              className="black-btn"
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "12px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: submitting ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
};

export default BookRide;