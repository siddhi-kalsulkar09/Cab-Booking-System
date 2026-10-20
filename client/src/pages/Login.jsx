import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      // const res = await axios.post(
      //   "https://cab-booking-system-server1.onrender.com/api/users/login",
      //   form
      // );
      const res = await API.post("/users/login", form);
      // 2. Change 'axios.post' to 'API.post' and pass just the endpoint path
      // It will automatically use localhost locally or Render in production
      // const res = await API.post("/users/login", form);
      // const res = await axios.post(
      //   "https://cab-booking-system-server1.onrender.com/api/users/login",
      //   form
      // );
      // import.meta.env.VITE_API_BASE_URL
      login(res.data);

      alert("Login Successful ✅");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invalid Credentials ❌");
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
          onClick={() => navigate("/register")}
          style={{ cursor: "pointer" }}
        >
          Signup ▾
        </div>
      </div>

      {/* FORM */}
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
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
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              className="auth-black-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-text">New user?</div>

          <button
            className="auth-yellow-btn"
            onClick={() => navigate("/register")}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;