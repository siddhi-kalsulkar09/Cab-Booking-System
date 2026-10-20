import API from "./api";

// ==================== PUBLIC / USER ====================
export const getAllCars = async () => {
  const res = await API.get("/cars");
  return res.data;
};

export const getAvailableCars = async () => {
  const res = await API.get("/cars/available");
  return res.data;
};

export const getCarById = async (id) => {
  const res = await API.get(`/cars/${id}`);
  return res.data;
};

export const getCarsByType = async (type) => {
  const res = await API.get(`/cars/type/${type}`);
  return res.data;
};

// ==================== ADMIN ====================
export const addCar = async (formData) => {
  const res = await API.post("/cars", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateCar = async (id, formData) => {
  const res = await API.put(`/cars/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteCar = async (id) => {
  const res = await API.delete(`/cars/${id}`);
  return res.data;
};

export const toggleCarAvailability = async (id) => {
  const res = await API.put(`/cars/toggle/${id}`);
  return res.data;
};

export const assignDriverToCar = async (carId, driverId) => {
  const res = await API.put(`/cars/assign-driver/${carId}`, { driverId });
  return res.data;
};