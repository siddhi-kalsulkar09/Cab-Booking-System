import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters ❌");
      return;
    }

    setLoading(true);

    try {
      await API.post("/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      alert("Registration Successful ✅ Please login");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* TOP BAR */}
      <div className="topbar">
        <div>Cab Booking System</div>
        <div
          onClick={() => navigate("/login")}
          style={{ cursor: "pointer" }}
        >
          Login ▾
        </div>
      </div>

      {/* FORM */}
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>Register</h2>

          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              className="auth-input"
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              className="auth-input"
              name="phone"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              className="auth-input"
              name="password"
              type="password"
              placeholder="Password (min 6)"
              value={form.password}
              onChange={handleChange}
              required
            />

            <input
              className="auth-input"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              className="auth-black-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>

          <div className="auth-text">Already have an account?</div>

          <button
            className="auth-yellow-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;