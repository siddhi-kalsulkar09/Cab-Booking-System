import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Public Pages
import Landing from "../pages/Landing";
import LoginSelector from "../pages/LoginSelector";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminRegister from "../pages/admin/AdminRegister";

// User Pages
import UserHome from "../pages/UserHome";
import Cabs from "../pages/Cabs";
import BookRide from "../pages/BookRide";
import MyBookings from "../pages/MyBookings";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminAddCab from "../pages/admin/AdminAddCab";
import AdminCabs from "../pages/admin/AdminCabs";
import AdminEditCab from "../pages/admin/AdminEditCab";
import AdminBookings from "../pages/admin/AdminBookings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route path="/" element={<Landing />} />
        <Route path="/select-login" element={<LoginSelector />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* ==================== USER PROTECTED ROUTES ==================== */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cabs"
          element={
            <ProtectedRoute>
              <Cabs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookRide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mybookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN PROTECTED ROUTES ==================== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addcab"
          element={
            <ProtectedRoute adminOnly>
              <AdminAddCab />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cabs"
          element={
            <ProtectedRoute adminOnly>
              <AdminCabs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <AdminEditCab />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        {/* ==================== 404 FALLBACK ==================== */}
        <Route
          path="*"
          element={
            <div style={{ padding: "60px", textAlign: "center" }}>
              <h1>404 — Page Not Found</h1>
              <a href="/" style={{ color: "#f4a300" }}>
                Go Home
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;