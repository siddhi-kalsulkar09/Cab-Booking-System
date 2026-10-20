import API from "./api";

// ==================== USER BOOKING ====================
export const createBooking = async (data) => {
  const res = await API.post("/bookings", data);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await API.get("/bookings/my");
  return res.data;
};

export const getBookingById = async (id) => {
  const res = await API.get(`/bookings/${id}`);
  return res.data;
};

export const cancelBooking = async (id, reason = "") => {
  const res = await API.put(`/bookings/cancel/${id}`, { reason });
  return res.data;
};

export const previewFare = async (carId, distance) => {
  const res = await API.post("/bookings/calculate-fare", {
    carId,
    distance,
  });
  return res.data;
};

// ==================== ADMIN BOOKING ====================
export const getAllBookings = async () => {
  const res = await API.get("/bookings/all");
  return res.data;
};

export const updateBookingStatus = async (id, status, driverId = null) => {
  const res = await API.put(`/bookings/status/${id}`, {
    status,
    driverId,
  });
  return res.data;
};

export const deleteBooking = async (id) => {
  const res = await API.delete(`/bookings/${id}`);
  return res.data;
};