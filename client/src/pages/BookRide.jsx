import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import API from "../services/api";
import Navbar from "../components/Navbar";

function BookRide() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [distanceError, setDistanceError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash"); // cash | card | upi
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });
  const [pendingBooking, setPendingBooking] = useState(null);

  const [form, setForm] = useState({
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    pickupTime: "",
    distance: "",
  });

  const debounceRef = useRef(null);

  // Fetch car
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await API.get(`/cars/${id}`);
        setCar(res.data);
      } catch (error) {
        alert("Car not found");
        navigate("/cabs");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  // AUTO DISTANCE
  useEffect(() => {
    if (!form.pickupLocation || !form.dropLocation) {
      setDistanceError("");
      return;
    }

    if (form.pickupLocation.length < 3 || form.dropLocation.length < 3) {
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setCalculating(true);
      setDistanceError("");

      try {
        const res = await API.post(
          "/bookings/calculate-distance",
          {
            pickup: form.pickupLocation,
            drop: form.dropLocation,
          }
        );

        setForm((prev) => ({ ...prev, distance: res.data.distance }));
        setDistanceError("");
      } catch (error) {
        setDistanceError(
          error.response?.data?.message ||
            "Location not found. Try a different name."
        );
        setForm((prev) => ({ ...prev, distance: "" }));
      } finally {
        setCalculating(false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form.pickupLocation, form.dropLocation]);

  // AUTO FARE
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

  const handleCardChange = (e) =>
    setCardForm({ ...cardForm, [e.target.name]: e.target.value });

  // ==================== SUBMIT BOOKING ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.distance) {
      alert("Please wait for distance calculation ❌");
      return;
    }

    if (!estimatedFare) {
      alert("Fare not calculated yet ❌");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/bookings",
        {
          carId: id,
          pickupLocation: form.pickupLocation,
          dropLocation: form.dropLocation,
          pickupDate: form.pickupDate,
          pickupTime: form.pickupTime,
          distance: Number(form.distance),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const booking = res.data.booking;

      if (paymentMethod === "cash") {
        alert(
          `Booking Confirmed ✅\n\nPay ₹${estimatedFare} in cash after your ride.\n\nDriver will contact you shortly.`
        );
        navigate("/mybookings");
      } else {

        setPendingBooking(booking);
        setShowPaymentModal(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Booking Failed ❌");
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== FAKE PAYMENT ====================
  const handlePayNow = async () => {
    if (paymentMethod === "card") {
      if (!cardForm.cardNumber || !cardForm.cvv || !cardForm.cardName) {
        alert("Please fill card details ❌");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!cardForm.upiId) {
        alert("Please enter UPI ID ❌");
        return;
      }
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/payments",
        {
          bookingId: pendingBooking._id,
          amount: estimatedFare,
          method: paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment Successful ✅ Booking Confirmed!");
      setShowPaymentModal(false);
      navigate("/mybookings");
    } catch (error) {
      alert(error.response?.data?.message || "Payment Failed ❌");
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "40px 20px",
          background: "#fdf3d1",
          minHeight: "100vh",
        }}
      >
        <div style={cardStyle}>
          <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
            Book Your Ride 🚗
          </h2>

          <div style={carInfoStyle}>
            <p>
              <strong>Car:</strong> {car.carName} ({car.carType})
            </p>
            <p>
              <strong>Number:</strong> {car.carNumber}
            </p>
            <p>
              <strong>Rate:</strong> ₹{car.pricePerKm}/km
            </p>
            <p>
              <strong>Seats:</strong> {car.seats}
            </p>
            <p><strong>Driver:</strong> {car.driver || "To be assigned"}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              name="pickupLocation"
              placeholder="Pickup Location (e.g., Pune Station)"
              value={form.pickupLocation}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="dropLocation"
              placeholder="Drop Location (e.g., Hinjewadi)"
              value={form.dropLocation}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <div style={{ minHeight: "24px", marginBottom: "10px" }}>
              {calculating && (
                <p style={calcText}>📍 Calculating distance...</p>
              )}
              {!calculating && form.distance && (
                <p style={{ ...calcText, color: "#2e7d32" }}>
                  ✅ Distance: <strong>{form.distance} km</strong>
                </p>
              )}
              {distanceError && (
                <p style={{ ...calcText, color: "#c62828" }}>
                  ❌ {distanceError}
                </p>
              )}
            </div>

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

            {estimatedFare > 0 && (
              <div style={fareStyle}>
                <div style={{ fontSize: "13px", color: "#666" }}>
                  Total Fare
                </div>
                <div
                  style={{
                    color: "#2e7d32",
                    fontSize: "32px",
                    fontWeight: "bold",
                  }}
                >
                  ₹{estimatedFare}
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  ({form.distance} km × ₹{car.pricePerKm}/km + base)
                </div>
              </div>
            )}

            {/* Payment Method — 3 OPTIONS */}
            <div style={{ marginTop: "18px", marginBottom: "10px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px" }}>
                Payment Method
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <PaymentOption
                  icon="💵"
                  label="Cash"
                  value="cash"
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
                <PaymentOption
                  icon="💳"
                  label="Card"
                  value="card"
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
                <PaymentOption
                  icon="📱"
                  label="UPI"
                  value="upi"
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !form.distance}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "16px",
                background: !form.distance ? "#ccc" : "#1a1a2e",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor:
                  submitting || !form.distance
                    ? "not-allowed"
                    : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting
                ? "Processing..."
                : !form.distance
                ? "Waiting for distance..."
                : paymentMethod === "cash"
                ? "Confirm Booking"
                : "Confirm & Pay"}
            </button>
          </form>
        </div>
      </div>

      {/* ==================== PAYMENT MODAL ==================== */}
      {showPaymentModal && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ marginBottom: "16px", textAlign: "center" }}>
              {paymentMethod === "card"
                ? "💳 Card Payment"
                : "📱 UPI Payment"}
            </h3>

            <div style={modalAmountStyle}>
              Amount to Pay:{" "}
              <strong style={{ fontSize: "24px" }}>₹{estimatedFare}</strong>
            </div>

            {paymentMethod === "card" ? (
              <>
                <input
                  name="cardNumber"
                  placeholder="Card Number (4111 1111 1111 1111)"
                  value={cardForm.cardNumber}
                  onChange={handleCardChange}
                  maxLength={19}
                  style={inputStyle}
                />
                <input
                  name="cardName"
                  placeholder="Cardholder Name"
                  value={cardForm.cardName}
                  onChange={handleCardChange}
                  style={inputStyle}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    name="expiry"
                    placeholder="MM/YY"
                    value={cardForm.expiry}
                    onChange={handleCardChange}
                    maxLength={5}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <input
                    name="cvv"
                    placeholder="CVV"
                    type="password"
                    value={cardForm.cvv}
                    onChange={handleCardChange}
                    maxLength={4}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
                <p style={testHint}>
                  💡 Test: <code>4111 1111 1111 1111</code> | Any CVV | Any
                  future date
                </p>
              </>
            ) : (
              <>
                <input
                  name="upiId"
                  placeholder="yourname@upi"
                  value={cardForm.upiId}
                  onChange={handleCardChange}
                  style={inputStyle}
                />
                <p style={testHint}>
                  💡 Test: <code>test@upi</code>
                </p>
              </>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#eee",
                  border: "none",
                  borderRadius: "8px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePayNow}
                disabled={submitting}
                style={{
                  flex: 2,
                  padding: "12px",
                  background: "#f4a300",
                  border: "none",
                  borderRadius: "8px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: "700",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? "Processing..." : `Pay ₹${estimatedFare}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ==================== COMPONENTS ====================
function PaymentOption({ icon, label, value, selected, onSelect }) {
  const isActive = selected === value;
  return (
    <div
      onClick={() => onSelect(value)}
      style={{
        flex: 1,
        padding: "12px 8px",
        border: isActive ? "2px solid #f4a300" : "2px solid #ddd",
        background: isActive ? "#fff7e6" : "#fff",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.2s",
      }}
    >
      <div style={{ fontSize: "22px" }}>{icon}</div>
      <div
        style={{
          fontSize: "12px",
          fontWeight: isActive ? "700" : "500",
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ==================== STYLES ====================
const cardStyle = {
  width: "500px",
  maxWidth: "100%",
  margin: "auto",
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
};

const carInfoStyle = {
  background: "#f9f9f9",
  padding: "14px",
  borderRadius: "8px",
  marginBottom: "20px",
  fontSize: "14px",
  lineHeight: "1.7",
};

const fareStyle = {
  background: "#e8f5e9",
  padding: "16px",
  borderRadius: "8px",
  marginTop: "10px",
  textAlign: "center",
};

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

const calcText = {
  margin: 0,
  fontSize: "13px",
  color: "#1976d2",
  textAlign: "center",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalCard = {
  background: "#fff",
  padding: "28px",
  borderRadius: "14px",
  width: "400px",
  maxWidth: "100%",
  boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
};

const modalAmountStyle = {
  background: "#fff3e0",
  padding: "12px",
  borderRadius: "8px",
  textAlign: "center",
  marginBottom: "16px",
  color: "#ef6c00",
};

const testHint = {
  fontSize: "11px",
  color: "#888",
  textAlign: "center",
  margin: "4px 0 12px",
};

export default BookRide;