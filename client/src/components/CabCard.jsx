import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop";

const getImageByType = (type) => {
  const images = {
    hatchback:
      "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=400&h=250&fit=crop",
    sedan:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop",
    suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop",
    luxury:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
  };
  return images[type] || FALLBACK_IMAGE;
};

function CabCard({ car }) {
  const navigate = useNavigate();

  const imageUrl = car.carImage
    ? `http://localhost:8000/${car.carImage}`
    : getImageByType(car.carType);

  const driverName = car.driver?.name || "To be assigned";

  return (
    <div className="cab-card">
      <img
        src={imageUrl}
        alt={car.carName}
        className="cab-image"
        onError={(e) => {
          e.target.src = FALLBACK_IMAGE;
        }}
      />

      <h3>{car.carName}</h3>

      <div className="cab-details">
        <p>
          <strong>🚗 Car:</strong> {car.carName} {car.brand && `(${car.brand})`}
        </p>
        <p>
          <strong>Type:</strong> {car.carType}
        </p>
        <p>
          <strong>Car No:</strong> {car.carNumber}
        </p>
        <p>
          <strong>Seats:</strong> {car.seats}
        </p>
        <p>
          <strong>Driver:</strong> {car.driver}
        </p>
        <p>
          <strong>Rating:</strong> ⭐ {car.rating || 5}
        </p>
        <p>
          <strong>Fare:</strong> ₹{car.pricePerKm}/Km
        </p>

        <button
          className="book-btn"
          onClick={() => navigate(`/book/${car._id}`)}
          disabled={!car.available}
        >
          {car.available ? "Book Cab" : "Not Available"}
        </button>
      </div>
    </div>
  );
}

export default CabCard;