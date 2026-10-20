import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post(
        "/admin/login",
        form
      );

      adminLogin(res.data);

      alert("Admin Login Successful ✅");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invalid Admin Credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: "48px", textAlign: "center" }}>👑</div>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Admin Login
        </h2>

        <form onSubmit={handleSubmit}>
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
            name="password"
            type="password"
            placeholder="Password"
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
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

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

export default AdminLogin;