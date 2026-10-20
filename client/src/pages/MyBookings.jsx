import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import BookingCard from "../components/BookingCard";
import { API_BASE_URL } from "../utils/constants";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==================== FETCH BOOKINGS ====================
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE_URL}/bookings/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert(error.response?.data?.message || "Failed to load bookings ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==================== CANCEL BOOKING ====================
  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE_URL}/bookings/cancel/${bookingId}`,
        { reason: "Cancelled by user" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Booking cancelled successfully ✅");
      fetchBookings(); // refresh list
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Cancel failed ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#e6d8b5",
          minHeight: "100vh",
          padding: "40px 20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#1a1a2e",
          }}
        >
          My Bookings 📜
        </h2>

        {/* Loading */}
        {loading && (
          <h3 style={{ textAlign: "center" }}>Loading bookings...</h3>
        )}

        {/* No bookings */}
        {!loading && bookings.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <div style={{ fontSize: "60px" }}>🚫</div>
            <h3 style={{ color: "#666" }}>No Bookings Yet</h3>
            <p style={{ color: "#888" }}>
              Book your first ride to see it here.
            </p>
          </div>
        )}

        {/* Bookings list */}
        {!loading && bookings.length > 0 && (
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyBookings;