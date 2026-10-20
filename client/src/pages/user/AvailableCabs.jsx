import { useEffect, useState } from "react";
import { getAllCars } from "../../services/carService";
import CarCard from "../../components/user/CarCard";

const AvailableCars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getAllCars();
        setCars(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCars();
  }, []);

return (
  <div>
    <h2 style={{ textAlign: "center", marginTop: "20px" }}>
      Available Cars
    </h2>

    <div className="cars-wrapper">
      {cars.length > 0 ? (
        cars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))
      ) : (
        <p style={{ textAlign: "center" }}>No cars available</p>
      )}
    </div>
  </div>
);
};

export default AvailableCars;