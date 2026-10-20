function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h3 style={titleStyle}>🚗 Cab Booking System</h3>
          <p style={textStyle}>
            Your reliable cab booking partner. Book rides easily, anytime,
            anywhere.
          </p>
        </div>

        <div style={sectionStyle}>
          <h4 style={headingStyle}>Quick Links</h4>
          <ul style={listStyle}>
            <li style={linkStyle}>Home</li>
            <li style={linkStyle}>Book a Cab</li>
            <li style={linkStyle}>My Bookings</li>
            <li style={linkStyle}>Contact Us</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h4 style={headingStyle}>Support</h4>
          <ul style={listStyle}>
            <li style={linkStyle}>Help Center</li>
            <li style={linkStyle}>Terms of Service</li>
            <li style={linkStyle}>Privacy Policy</li>
            <li style={linkStyle}>Refund Policy</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h4 style={headingStyle}>Contact</h4>
          <p style={textStyle}>📞 +91 98765 43210</p>
          <p style={textStyle}>✉️ support@CabBookingSystem.com</p>
          <p style={textStyle}>📍 Mumbai, Maharashtra</p>
        </div>
      </div>

      <div style={bottomBar}>
        <p style={{ margin: 0 }}>
          © {currentYear} Cab Booking System. All rights reserved. | Made with ❤️ in India
        </p>
      </div>
    </footer>
  );
}

const footerStyle = {
  background: "#1a1a2e",
  color: "#ccc",
  marginTop: "auto",
  paddingTop: "40px",
};

const containerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "30px",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 40px 30px",
};

const sectionStyle = {
  display: "flex",
  flexDirection: "column",
};

const titleStyle = {
  color: "#f4a300",
  margin: "0 0 12px",
  fontSize: "22px",
};

const headingStyle = {
  color: "#fff",
  margin: "0 0 12px",
  fontSize: "16px",
};

const textStyle = {
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "4px 0",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const linkStyle = {
  fontSize: "14px",
  marginBottom: "8px",
  cursor: "pointer",
  transition: "color 0.2s",
};

const bottomBar = {
  borderTop: "1px solid #333",
  padding: "16px 40px",
  textAlign: "center",
  fontSize: "13px",
  color: "#888",
};

export default Footer;