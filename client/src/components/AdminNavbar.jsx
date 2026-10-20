import { useNavigate, useLocation } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname === path;

  const links = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Cabs", path: "/admin/cabs" },
    { label: "Add Cab", path: "/admin/addcab" },
    { label: "Bookings", path: "/admin/bookings" },
  ];

  return (
    <div style={navbarStyle}>
      <div style={logoStyle} onClick={() => navigate("/admin/dashboard")}>
        🚗 Cab Booking System <span style={adminBadge}>Admin</span>
      </div>

      <div style={linksContainer}>
        {links.map((link) => (
          <span
            key={link.path}
            style={{
              ...linkStyle,
              ...(isActive(link.path) ? activeLinkStyle : {}),
            }}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </span>
        ))}

        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const navbarStyle = {
  background: "#1a1a2e",
  padding: "15px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
};

const logoStyle = {
  color: "#fff",
  fontSize: "20px",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const adminBadge = {
  fontSize: "11px",
  background: "#f4a300",
  color: "#000",
  padding: "3px 8px",
  borderRadius: "4px",
  fontWeight: "600",
};

const linksContainer = {
  display: "flex",
  gap: "24px",
  alignItems: "center",
};

const linkStyle = {
  cursor: "pointer",
  color: "#ccc",
  fontSize: "15px",
  padding: "6px 10px",
  borderRadius: "6px",
  transition: "all 0.2s",
};

const activeLinkStyle = {
  color: "#f4a300",
  background: "rgba(244, 163, 0, 0.1)",
  fontWeight: "600",
};

const logoutBtn = {
  background: "#e63946",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};

export default AdminNavbar;