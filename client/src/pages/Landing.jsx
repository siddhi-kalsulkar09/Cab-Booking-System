import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ==================== TOP BAR ==================== */}
      <div className="topbar">
        <div style={{ fontWeight: "bold", fontSize: "20px" }}>
          🚗 Cab Booking System
        </div>
        <div
          className="login-link"
          onClick={() => navigate("/select-login")}
          style={{ cursor: "pointer", fontWeight: "600" }}
        >
          Login ▾
        </div>
      </div>

      {/* ==================== HERO SECTION ==================== */}
      <div
        className="hero-container"
        style={{ flex: 1, padding: "60px 20px", textAlign: "center" }}
      >
        <div
          className="hero-title"
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#1a1a2e",
            marginBottom: "16px",
          }}
        >
          Your Ride, Your Way
        </div>

        <div
          className="hero-subtitle"
          style={{
            fontSize: "18px",
            color: "#555",
            marginBottom: "30px",
            maxWidth: "600px",
            margin: "0 auto 30px",
          }}
        >
          Reliable. Fast. Affordable. Book cabs anytime, anywhere.
        </div>

        <button
          className="explore-btn"
          onClick={() => navigate("/cabs")}
          style={{
            padding: "14px 32px",
            background: "#f4a300",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
        >
          Explore Services
        </button>

        <div style={{ marginTop: "40px" }}>
          <img
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop"
            alt="Taxi"
            style={{
              width: "350px",
              maxWidth: "90%",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/600x400/FFA500/FFFFFF?text=Taxi";
            }}
          />
        </div>
      </div>

      {/* ==================== FEATURES SECTION ==================== */}
      <div
        style={{
          padding: "60px 40px",
          background: "#f9f9f9",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <FeatureCard
          icon="⚡"
          title="Fast Booking"
          text="Book your cab in seconds with our simple interface."
        />
        <FeatureCard
          icon="💰"
          title="Affordable"
          text="Best prices with transparent fare calculation."
        />
        <FeatureCard
          icon="🛡️"
          title="Safe Rides"
          text="Verified drivers and well-maintained cars."
        />
        <FeatureCard
          icon="🕒"
          title="24/7 Support"
          text="Round-the-clock customer support for you."
        />
      </div>

      {/* ==================== FOOTER ==================== */}
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>{icon}</div>
      <h3 style={{ margin: "0 0 8px", color: "#1a1a2e" }}>{title}</h3>
      <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{text}</p>
    </div>
  );
}

export default Landing;