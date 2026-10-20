import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, background: "#e6d8b5" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default UserLayout;