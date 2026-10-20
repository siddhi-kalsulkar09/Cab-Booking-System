import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AdminNavbar />
      <div style={{ flex: 1, background: "#f4f6f8" }}>
        <Outlet />
      </div>
      <div
        style={{
          background: "#1a1a2e",
          color: "#888",
          textAlign: "center",
          padding: "14px",
          fontSize: "13px",
        }}
      >
        © {new Date().getFullYear()} UCab Admin Panel
      </div>
    </div>
  );
}

export default AdminLayout;