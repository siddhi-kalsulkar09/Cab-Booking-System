import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/select-login");
  };

  return (
    <div style={navbarStyle}>
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>🚗 Cab Booking System</div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {role === "admin" && (
          <>
            <span style={linkStyle} onClick={() => navigate("/admin/dashboard")}>
              Dashboard
            </span>
            <span style={linkStyle} onClick={() => navigate("/admin/users")}>
              Users
            </span>
            <span style={linkStyle} onClick={() => navigate("/admin/cabs")}>
              Cabs
            </span>
            <span style={linkStyle} onClick={() => navigate("/admin/addcab")}>
              Add Cab
            </span>
            <span style={linkStyle} onClick={() => navigate("/admin/bookings")}>
              Bookings
            </span>
          </>
        )}

        {role === "user" && (
          <>
            <span style={linkStyle} onClick={() => navigate("/home")}>
              Home
            </span>
            <span style={linkStyle} onClick={() => navigate("/cabs")}>
              Book Cab
            </span>
            <span style={linkStyle} onClick={() => navigate("/mybookings")}>
              My Bookings
            </span>
          </>
        )}

        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const navbarStyle = {
  background: "#f4a300",
  padding: "15px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
};

const linkStyle = {
  cursor: "pointer",
  color: "#1a1a1a",
  fontWeight: "500",
};

const logoutBtn = {
  background: "black",
  color: "white",
  border: "none",
  padding: "6px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

export default Navbar;