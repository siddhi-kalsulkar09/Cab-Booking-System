import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop";

const getImageByType = (type) => {
  const images = {
    hatchback:
      "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=400&h=250&fit=crop",
    sedan:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop",
    suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop",
    luxury:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
  };
  return images[type] || FALLBACK_IMAGE;
};

function AdminCabs() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const deleteCar = async (id) => {
    const confirm = window.confirm("Delete this car permanently?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("adminToken");
      await API.delete(`/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Car deleted ✅");
      fetchCars();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed ❌");
    }
  };

  const toggleAvailable = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await API.put(
        `/cars/toggle/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCars();
    } catch (error) {
      console.error(error);
      alert("Toggle failed ❌");
    }
  };

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto 30px",
          }}
        >
          <h2 style={{ color: "#1a1a2e", margin: 0 }}>Manage Cabs 🚗</h2>
          <button onClick={() => navigate("/admin/addcab")} style={addBtn}>
            + Add New Cab
          </button>
        </div>

        {loading && (
          <h3 style={{ textAlign: "center" }}>Loading cars...</h3>
        )}

        {!loading && cars.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <div style={{ fontSize: "60px" }}>🚫</div>
            <h3 style={{ color: "#666" }}>No Cars Added Yet</h3>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {cars.map((car) => {
            const imageUrl = car.carImage
              ? `http://localhost:8000/${car.carImage}`
              : getImageByType(car.carType);

            return (
              <div key={car._id} style={cardStyle}>
                <img
                  src={imageUrl}
                  alt={car.carName}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />

                <div style={{ marginTop: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "16px" }}>
                      {car.carName}
                    </h3>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: car.available ? "#e8f5e9" : "#ffebee",
                        color: car.available ? "#2e7d32" : "#c62828",
                        fontWeight: "600",
                      }}
                    >
                      {car.available ? "AVAILABLE" : "BUSY"}
                    </span>
                  </div>

                  <p style={rowStyle}>
                    <strong>Type:</strong> {car.carType}
                  </p>
                  <p style={rowStyle}>
                    <strong>Number:</strong> {car.carNumber}
                  </p>
                  <p style={rowStyle}>
                    <strong>Seats:</strong> {car.seats}
                  </p>
                  <p style={rowStyle}>
                    <strong>Driver:</strong>{" "}
                    {car.driver?.name || "Not assigned"}
                  </p>
                  <p style={rowStyle}>
                    <strong>Price:</strong>{" "}
                    <span style={{ color: "#2e7d32", fontWeight: "600" }}>
                      ₹{car.pricePerKm}/km
                    </span>
                  </p>

                  <div
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() => navigate(`/admin/edit/${car._id}`)}
                      style={editBtn}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleAvailable(car._id)}
                      style={toggleBtn}
                    >
                      {car.available ? "Set Busy" : "Set Available"}
                    </button>

                    <button
                      style={deleteBtn}
                      onClick={() => deleteCar(car._id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  transition: "transform 0.2s",
};

const rowStyle = {
  margin: "4px 0",
  fontSize: "13px",
  color: "#555",
};

const addBtn = {
  background: "#f4a300",
  color: "#000",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

const editBtn = {
  flex: 1,
  background: "#1a1a2e",
  color: "#fff",
  padding: "8px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
};

const toggleBtn = {
  flex: 1,
  background: "#e3f2fd",
  color: "#1976d2",
  padding: "8px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
};

const deleteBtn = {
  background: "#ffebee",
  color: "#c62828",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
};

export default AdminCabs;