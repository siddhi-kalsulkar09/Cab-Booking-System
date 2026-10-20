import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../services/api.js"
import AdminNavbar from "../../components/AdminNavbar";

function AdminEditCab() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ==================== FETCH EXISTING CAR ====================
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await API.get(`/api/cars/${id}`);
        const car = res.data;

        setForm({
          carName: car.carName || "",
          brand: car.brand || "",
          model: car.model || "",
          carType: car.carType || "sedan",
          carNumber: car.carNumber || "",
          seats: car.seats || 4,
          pricePerKm: car.pricePerKm || "",
          pricePerDay: car.pricePerDay || "",
          carImage: null,
        });

        if (car.carImage) {
          setPreview(`http://localhost:8000/${car.carImage}`);
        }
      } catch (error) {
        console.error(error);
        alert("Car not found ❌");
        navigate("/admin/cabs");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  // ==================== HANDLE CHANGE ====================
  const handleChange = (e) => {
    if (e.target.name === "carImage") {
      const file = e.target.files[0];
      setForm({ ...form, carImage: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // ==================== HANDLE UPDATE ====================
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

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

      await API.put(`/cars/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Car Updated Successfully ✅");
      navigate("/admin/cabs");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update failed ❌");
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div style={{ padding: "60px", textAlign: "center" }}>
          Loading car data...
        </div>
      </>
    );
  }

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
            maxWidth: "450px",
            margin: "0 auto",
            background: "#fff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Edit Car 🚗
          </h2>

          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="carName"
              value={form.carName}
              onChange={handleChange}
              placeholder="Car Name"
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              style={inputStyle}
            />

            <input
              type="text"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Model"
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
              value={form.carNumber}
              onChange={handleChange}
              placeholder="Car Number"
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="seats"
              value={form.seats}
              onChange={handleChange}
              placeholder="Seats"
              min="2"
              max="10"
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="pricePerKm"
              value={form.pricePerKm}
              onChange={handleChange}
              placeholder="Price Per Km"
              required
              style={inputStyle}
            />

            <input
              type="number"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={handleChange}
              placeholder="Price Per Day (optional)"
              style={inputStyle}
            />

            <div style={{ marginTop: "10px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px" }}>
                Car Image
              </label>
              <input
                type="file"
                name="carImage"
                accept="image/*"
                onChange={handleChange}
                style={{ marginTop: "6px", display: "block" }}
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginTop: "12px",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                background: "#f4a300",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: submitting ? "not-allowed" : "pointer",
                fontSize: "15px",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// ==================== STYLES ====================
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxSizing: "border-box",
};

export default AdminEditCab;