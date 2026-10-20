import { useState } from "react";
import axios from "axios";
import API from "../services/api"
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";

function AdminAddCab() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    carName: "",
    brand: "",
    model: "",
    carType: "sedan",
    carNumber: "",
    seats: 4,
    pricePerKm: "",
    pricePerDay: "",
    carImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "carImage") {
      const file = e.target.files[0];
      setForm({ ...form, carImage: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      const formData = new FormData();
      formData.append("carName", form.carName);
      formData.append("brand", form.brand);
      formData.append("model", form.model);
      formData.append("carType", form.carType);
      formData.append("carNumber", form.carNumber);
      formData.append("seats", form.seats);
      formData.append("pricePerKm", form.pricePerKm);
      formData.append("pricePerDay", form.pricePerDay || 0);
      if (form.carImage) {
        formData.append("carImage", form.carImage);
      }

      await API.post("/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Car Added Successfully! ✅");
      navigate("/admin/cabs");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add car ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Add New Car 🚗
          </h2>

          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              type="text"
              name="carName"
              placeholder="Car Name (e.g., Swift Dzire)"
              value={form.carName}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand (e.g., Maruti)"
              value={form.brand}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="model"
              placeholder="Model (e.g., 2023)"
              value={form.model}
              onChange={handleChange}
              style={inputStyle}
            />

            <select
              name="carType"
              value={form.carType}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="hatchback">Hatchback</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
            </select>

            <input
              type="text"
              name="carNumber"
              placeholder="Car Number (e.g., MH12AB1234)"
              value={form.carNumber}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="seats"
              placeholder="Seats"
              value={form.seats}
              onChange={handleChange}
              min="2"
              max="10"
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="pricePerKm"
              placeholder="Price per Km (₹)"
              value={form.pricePerKm}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="pricePerDay"
              placeholder="Price per Day (₹) - optional"
              value={form.pricePerDay}
              onChange={handleChange}
              style={inputStyle}
            />

            <label style={{ fontWeight: "bold", marginBottom: "6px" }}>
              Car Image
            </label>

            <input
              type="file"
              name="carImage"
              accept="image/*"
              onChange={handleChange}
              style={{ marginBottom: "15px" }}
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "15px",
                }}
              />
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Adding..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* ================= STYLES ================= */
const containerStyle = {
  background: "#f4f6f8",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
};

const cardStyle = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "12px",
  width: "400px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const buttonStyle = {
  background: "#f4a300",
  padding: "12px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px",
};

export default AdminAddCab;