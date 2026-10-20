import API from "./api";

// ==================== USER AUTH ====================
export const registerUser = async (data) => {
  const res = await API.post("/users/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await API.post("/users/login", data);
  return res.data;
};

// ==================== ADMIN AUTH ====================
export const registerAdmin = async (data) => {
  const res = await API.post("/admin/register", data);
  return res.data;
};

export const loginAdmin = async (data) => {
  const res = await API.post("/admin/login", data);
  return res.data;
};