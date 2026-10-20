import { useEffect, useState } from "react";
import axios from "axios";
import API from "../services/api";
import Navbar from "../components/Navbar";
import CabCard from "../components/CabCard";

function Cabs() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");

  // ==================== FETCH CARS ====================
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await API.get("/cars");
        setCars(res.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // ==================== FILTER ====================
  const filteredCars = cars
    .filter((car) =>
      car.carName?.toLowerCase().includes(searchName.toLowerCase())
    )
    .filter((car) =>
      car.carType?.toLowerCase().includes(searchType.toLowerCase())
    );

  // ==================== SORT ====================
  const sortLowToHigh = () => {
    const sorted = [...filteredCars].sort(
      (a, b) => a.pricePerKm - b.pricePerKm
    );
    setCars(sorted);
  };

  return (
    <>
      <Navbar />

      <div className="cabs-container" style={{ padding: "30px 40px" }}>
        <h2 className="cabs-title" style={{ textAlign: "center" }}>
          Available Cabs 🚗
        </h2>

        {/* ==================== CONTROLS ==================== */}
        <div
          className="cabs-controls"
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Search by car name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Search by type (sedan/suv/luxury)"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={inputStyle}
          />

          <button onClick={sortLowToHigh} style={sortBtn}>
            Sort Price: Low → High
          </button>
        </div>

        {/* ==================== LOADING ==================== */}
        {loading && (
          <h3 style={{ textAlign: "center" }}>Loading cars...</h3>
        )}

        {/* ==================== CAR GRID ==================== */}
        {!loading && (
          <div
            className="cabs-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredCars.length === 0 ? (
              <h3 style={{ textAlign: "center", gridColumn: "1 / -1" }}>
                No Cars Found 🚫
              </h3>
            ) : (
              filteredCars.map((car) => (
                <CabCard key={car._id} car={car} />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ==================== STYLES ====================
const inputStyle = {
  padding: "10px 14px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "14px",
  minWidth: "220px",
};

const sortBtn = {
  padding: "10px 16px",
  background: "#f4a300",
  color: "#000",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

export default Cabs;