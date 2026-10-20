import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { API_BASE_URL } from "../../utils/constants";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ==================== FETCH USERS ====================
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(error.response?.data?.message || "Failed to load users ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==================== DELETE USER ====================
  const deleteUser = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted ✅");
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed ❌");
    }
  };

  // ==================== FILTER ====================
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

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
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* ==================== HEADER ==================== */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h2 style={{ color: "#1a1a2e", margin: 0 }}>Manage Users 👥</h2>

            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "10px 14px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "14px",
                minWidth: "260px",
              }}
            />
          </div>

          {/* ==================== TOTAL COUNT ==================== */}
          <div
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "10px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", color: "#666" }}>
              Total Users:
            </span>
            <span
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: "#f4a300",
              }}
            >
              {filteredUsers.length}
            </span>
          </div>

          {/* ==================== LOADING ==================== */}
          {loading && (
            <h3 style={{ textAlign: "center" }}>Loading users...</h3>
          )}

          {/* ==================== EMPTY ==================== */}
          {!loading && filteredUsers.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "60px" }}>
              <div style={{ fontSize: "60px" }}>👤</div>
              <h3 style={{ color: "#666" }}>No Users Found</h3>
            </div>
          )}

          {/* ==================== TABLE ==================== */}
          {!loading && filteredUsers.length > 0 && (
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ background: "#1a1a2e" }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      style={{
                        background: index % 2 === 0 ? "#fff" : "#fafafa",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdStyle}>
                        <strong>{user.name}</strong>
                      </td>
                      <td style={tdStyle}>{user.email}</td>
                      <td style={tdStyle}>{user.phone || "—"}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "3px 8px",
                            borderRadius: "10px",
                            background:
                              user.role === "admin"
                                ? "#fff3e0"
                                : "#e3f2fd",
                            color:
                              user.role === "admin" ? "#ef6c00" : "#1976d2",
                            fontWeight: "600",
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          style={deleteBtn}
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ==================== STYLES ==================== */
const thStyle = {
  padding: "14px 12px",
  color: "#fff",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "600",
  letterSpacing: "0.5px",
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
  color: "#333",
  textAlign: "left",
};

const deleteBtn = {
  background: "#ffebee",
  color: "#c62828",
  border: "none",
  padding: "6px 14px",
  cursor: "pointer",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "13px",
};

export default AdminUsers;