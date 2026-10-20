import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createBooking } from "../../services/bookingService";

const BookCar = () => {
  const { id } = useParams(); // car id
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBooking({
        carId: id,
        startDate: form.startDate,
        endDate: form.endDate,
      });

      alert("Car booked successfully!");
      navigate("/my-bookings");
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div>
      <h2>Book Car</h2>

      <form onSubmit={handleSubmit}>
        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          onChange={handleChange}
          required
        />

        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          onChange={handleChange}
          required
        />

        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookCar;