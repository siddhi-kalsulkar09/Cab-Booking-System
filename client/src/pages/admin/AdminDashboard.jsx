import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/constants";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalDrivers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // ==================== FETCH STATS ====================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `${API_BASE_URL}/admin/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStats(res.data);
      } catch (error) {
        console.error("Dashboard error:", error);
        alert(error.response?.data?.message || "Failed to load stats ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ==================== CHART DATA ====================
  const chartData = {
    labels: ["Users", "Cars", "Drivers", "Bookings"],
    datasets: [
      {
        label: "Count",
        data: [
          stats.totalUsers,
          stats.totalCars,
          stats.totalDrivers,
          stats.totalBookings,
        ],
        backgroundColor: ["#f4a300", "#2196f3", "#9c27b0", "#4caf50"],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
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
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#1a1a2e",
          }}
        >
          Admin Dashboard 📊
        </h2>

        {loading && (
          <h3 style={{ textAlign: "center" }}>Loading dashboard...</h3>
        )}

        {!loading && (
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            {/* ==================== STAT BOXES ==================== */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <StatBox
                title="Total Users"
                value={stats.totalUsers}
                icon="👥"
                color="#2196f3"
              />
              <StatBox
                title="Total Cabs"
                value={stats.totalCars}
                icon="🚗"
                color="#f4a300"
              />
              <StatBox
                title="Total Drivers"
                value={stats.totalDrivers}
                icon="👨‍✈️"
                color="#9c27b0"
              />
              <StatBox
                title="Total Bookings"
                value={stats.totalBookings}
                icon="📋"
                color="#4caf50"
              />
            </div>

            {/* ==================== SECONDARY STATS ==================== */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginBottom: "30px",
              }}
            >
              <MiniStat
                label="Pending"
                value={stats.pendingBookings}
                color="#ff9800"
              />
              <MiniStat
                label="Completed"
                value={stats.completedBookings}
                color="#4caf50"
              />
              <MiniStat
                label="Cancelled"
                value={stats.cancelledBookings}
                color="#f44336"
              />
              <MiniStat
                label="Revenue"
                value={`₹${stats.totalRevenue}`}
                color="#2e7d32"
              />
            </div>

            {/* ==================== CHART ==================== */}
            <div
              style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#1a1a2e" }}>
                Overview
              </h3>
              <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* ==================== QUICK ACTIONS ==================== */}
            <div
              style={{
                marginTop: "30px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              <ActionBtn
                label="Manage Users"
                icon="👥"
                onClick={() => navigate("/admin/users")}
              />
              <ActionBtn
                label="Manage Cabs"
                icon="🚗"
                onClick={() => navigate("/admin/cabs")}
              />
              <ActionBtn
                label="Add New Cab"
                icon="➕"
                onClick={() => navigate("/admin/addcab")}
              />
              <ActionBtn
                label="View Bookings"
                icon="📋"
                onClick={() => navigate("/admin/bookings")}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ==================== COMPONENTS ==================== */
function StatBox({ title, value, icon, color }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ fontSize: "36px" }}>{icon}</div>
      <div>
        <div
          style={{
            fontSize: "13px",
            color: "#888",
            textTransform: "uppercase",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#1a1a2e",
            marginTop: "4px",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        textAlign: "center",
        borderTop: `3px solid ${color}`,
      }}
    >
      <div style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: color,
          marginTop: "6px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ActionBtn({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#1a1a2e",
        color: "#fff",
        border: "none",
        padding: "16px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "transform 0.15s",
      }}
    >
      <span style={{ fontSize: "18px" }}>{icon}</span>
      {label}
    </button>
  );
}

export default AdminDashboard;