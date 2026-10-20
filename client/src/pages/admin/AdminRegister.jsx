import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters ❌");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/admin/register", form);

      alert("Admin Registered Successfully ✅ Please login");
      navigate("/admin/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: "48px", textAlign: "center" }}>👑</div>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Admin Register
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="password"
            type="password"
            placeholder="Password (min 6)"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...blackBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#666",
            margin: "10px 0",
          }}
        >
          Already have an account?
        </div>

        <button
          style={yellowBtn}
          onClick={() => navigate("/admin/login")}
        >
          Login
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "16px",
            fontSize: "13px",
            color: "#888",
            cursor: "pointer",
          }}
          onClick={() => navigate("/select-login")}
        >
          ← Back to selection
        </div>
      </div>
    </div>
  );
}

// ==================== STYLES ====================
const wrapperStyle = {
  minHeight: "100vh",
  background: "#e6d8b5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const cardStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
  width: "320px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const blackBtn = {
  width: "100%",
  padding: "12px",
  background: "black",
  color: "white",
  border: "none",
  marginBottom: "14px",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "15px",
};

const yellowBtn = {
  width: "100%",
  padding: "12px",
  background: "#f4a300",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "15px",
};

export default AdminRegister;