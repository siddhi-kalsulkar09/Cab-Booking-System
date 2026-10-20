import { useNavigate } from "react-router-dom";

function BookingCard({
  booking,
  cars = [],
  onCancel,
  isAdmin = false,
  onStatusUpdate,
}) {
  const navigate = useNavigate();

  // Status color mapping
  const statusColors = {
    pending: "#ff9800",
    accepted: "#2196f3",
    started: "#9c27b0",
    completed: "#4caf50",
    cancelled: "#f44336",
  };

  const statusColor = statusColors[booking.status] || "#999";

  // Date format
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const carName = booking.carId?.carName || "N/A";
  const carNumber = booking.carId?.carNumber || "N/A";
  const bookingCarId = booking.carId?._id || booking.carId;
  const car = cars.find(
    (listedCar) => String(listedCar._id) === String(bookingCarId)
  );
  const driver =
    car?.driver?.name ||
    car?.driver ||
    booking.driver?.name ||
    booking.driver ||
    "To be assigned";
  const userName = booking.userId?.name || "N/A";
  const userPhone = booking.userId?.phone || "";

  const canCancel =
    !isAdmin && ["pending", "accepted"].includes(booking.status);

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div>
          <h4 style={{ margin: 0, color: "#1a1a2e" }}>
            🚗 {carName} <span style={carNumStyle}>({carNumber})</span>
          </h4>
          {isAdmin && (
            <p style={smallText}>
              👤 {userName} {userPhone && `• ${userPhone}`}
            </p>
          )}
        </div>
        <span style={{ ...statusBadge, background: statusColor }}>
          {booking.status.toUpperCase()}
        </span>
      </div>

      <div style={bodyStyle}>
        <p style={rowStyle}>
          <strong>📍 Pickup:</strong> {booking.pickupLocation}
        </p>
        <p style={rowStyle}>
          <strong>🎯 Drop:</strong> {booking.dropLocation}
        </p>
        <p style={rowStyle}>
          <strong>📅 Date:</strong> {formatDate(booking.pickupDate)} at{" "}
          {booking.pickupTime}
        </p>
        {booking.distance > 0 && (
          <p style={rowStyle}>
            <strong>📏 Distance:</strong> {booking.distance} km
          </p>
        )}
        <p style={rowStyle}>
          <strong>👨‍✈️ Driver:</strong> {driver}
        </p>
        <p style={{ ...rowStyle, marginTop: "10px", fontSize: "16px" }}>
          <strong>💰 Fare:</strong>{" "}
          <span style={{ color: "#4caf50", fontWeight: "bold" }}>
            ₹{booking.fare}
          </span>{" "}
          <span style={paymentBadge(booking.paymentStatus)}>
            {booking.paymentStatus}
          </span>
        </p>
      </div>

      <div style={footerStyle}>
        <span style={smallText}>
          Booked on {formatDate(booking.createdAt)}
        </span>

        <div style={{ display: "flex", gap: "8px" }}>
        
          {canCancel && onCancel && (
            <button
              onClick={() => onCancel(booking._id)}
              style={cancelBtn}
            >
              Cancel
            </button>
          )}

          {isAdmin && onStatusUpdate && (
            <>
              {booking.status === "pending" && (
                <button
                  onClick={() => onStatusUpdate(booking._id, "accepted")}
                  style={acceptBtn}
                >
                  Accept
                </button>
              )}
              {booking.status === "accepted" && (
                <button
                  onClick={() => onStatusUpdate(booking._id, "started")}
                  style={startBtn}
                >
                  Start
                </button>
              )}
              {booking.status === "started" && (
                <button
                  onClick={() => onStatusUpdate(booking._id, "completed")}
                  style={completeBtn}
                >
                  Complete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  padding: "16px",
  margin: "12px 0",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  borderBottom: "1px solid #f0f0f0",
  paddingBottom: "10px",
  marginBottom: "10px",
};

const carNumStyle = {
  fontSize: "13px",
  color: "#666",
  fontWeight: "normal",
};

const statusBadge = {
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "11px",
  fontWeight: "600",
};

const bodyStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const rowStyle = {
  margin: "2px 0",
  fontSize: "14px",
  color: "#333",
};

const smallText = {
  fontSize: "12px",
  color: "#888",
  margin: "2px 0",
};

const footerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "12px",
  paddingTop: "10px",
  borderTop: "1px solid #f0f0f0",
};

const btnBase = {
  padding: "6px 14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
};

const viewBtn = {
  ...btnBase,
  background: "#e3f2fd",
  color: "#1976d2",
};

const cancelBtn = {
  ...btnBase,
  background: "#ffebee",
  color: "#c62828",
};

const acceptBtn = {
  ...btnBase,
  background: "#e8f5e9",
  color: "#2e7d32",
};

const startBtn = {
  ...btnBase,
  background: "#f3e5f5",
  color: "#6a1b9a",
};

const completeBtn = {
  ...btnBase,
  background: "#e0f2f1",
  color: "#00695c",
};

const paymentBadge = (status) => ({
  fontSize: "10px",
  padding: "2px 6px",
  borderRadius: "4px",
  marginLeft: "6px",
  background:
    status === "paid" ? "#e8f5e9" : status === "refunded" ? "#fff3e0" : "#ffebee",
  color:
    status === "paid" ? "#2e7d32" : status === "refunded" ? "#ef6c00" : "#c62828",
});

export default BookingCard;