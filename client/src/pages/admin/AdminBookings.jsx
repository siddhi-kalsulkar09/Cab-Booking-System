import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import BookingCard from "../../components/BookingCard";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // ==================== FETCH BOOKINGS ====================
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:8000/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // ==================== UPDATE STATUS ====================
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:8000/api/admin/bookings/${bookingId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Booking marked as ${newStatus} ✅`);
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update failed ❌");
    }
  };

  // ==================== DELETE BOOKING ====================
  const handleDelete = async (bookingId) => {
    const confirm = window.confirm("Delete this booking permanently?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `http://localhost:8000/api/admin/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking deleted ✅");
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed ❌");
    }
  };

  // ==================== FILTER ====================
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const statuses = ["all", "pending", "accepted", "started", "completed", "cancelled"];

  return (
    <>
      <AdminNavbar />

      <div
        style={{
          background: "#f4f6f8",
          minHeight: "100vh",
          padding: "40px 20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#1a1a2e",
          }}
        >
          Manage Bookings 📋
        </h2>

        {/* ==================== FILTER TABS ==================== */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "20px",
                background: filter === s ? "#f4a300" : "#fff",
                color: filter === s ? "#000" : "#333",
                fontWeight: filter === s ? "600" : "400",
                cursor: "pointer",
                textTransform: "capitalize",
                fontSize: "13px",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ==================== LOADING ==================== */}
        {loading && (
          <h3 style={{ textAlign: "center" }}>Loading bookings...</h3>
        )}

        {/* ==================== NO BOOKINGS ==================== */}
        {!loading && filteredBookings.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <div style={{ fontSize: "60px" }}>📭</div>
            <h3 style={{ color: "#666" }}>No Bookings Found</h3>
          </div>
        )}

        {/* ==================== BOOKINGS LIST ==================== */}
        {!loading && filteredBookings.length > 0 && (
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {filteredBookings.map((booking) => (
              <div key={booking._id} style={{ position: "relative" }}>
                <BookingCard
                  booking={booking}
                  isAdmin={true}
                  onStatusUpdate={handleStatusUpdate}
                />

                {/* Delete button (top-right) */}
                <button
                  onClick={() => handleDelete(booking._id)}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "#ffebee",
                    color: "#c62828",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                  title="Delete booking"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AdminBookings;