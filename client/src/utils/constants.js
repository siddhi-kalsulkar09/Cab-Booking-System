// ==================== API ====================
const configuredApiUrl = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD && !configuredApiUrl) {
  throw new Error("VITE_API_URL must be set to the deployed backend API URL.");
}

export const API_BASE_URL = (
  configuredApiUrl || "http://localhost:8000/api"
).replace(/\/+$/, "");
export const SERVER_URL = API_BASE_URL.replace(/\/api$/i, "");

// ==================== ROLES ====================
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  DRIVER: "driver",
};

// ==================== BOOKING STATUS ====================
export const BOOKING_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  STARTED: "started",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const BOOKING_STATUS_LIST = [
  "pending",
  "accepted",
  "started",
  "completed",
  "cancelled",
];

// ==================== STATUS COLORS ====================
export const STATUS_COLORS = {
  pending: "#ff9800",
  accepted: "#2196f3",
  started: "#9c27b0",
  completed: "#4caf50",
  cancelled: "#f44336",
};

// ==================== PAYMENT ====================
export const PAYMENT_STATUS = {
  UNPAID: "unpaid",
  PAID: "paid",
  REFUNDED: "refunded",
};

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Credit/Debit Card" },
  { value: "upi", label: "UPI" },
  { value: "netbanking", label: "Net Banking" },
];

// ==================== CAR TYPES ====================
export const CAR_TYPES = [
  { value: "hatchback", label: "Hatchback" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "luxury", label: "Luxury" },
];

// ==================== FARE ====================
export const BASE_FARE = 50;
export const SURGE_MULTIPLIER = {
  hatchback: 1.0,
  sedan: 1.0,
  suv: 1.2,
  luxury: 1.5,
};

// ==================== ROUTES ====================
export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  LOGIN_SELECTOR: "/select-login",
  USER_HOME: "/home",
  CABS: "/cabs",
  BOOK_RIDE: "/book/:id",
  MY_BOOKINGS: "/mybookings",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_REGISTER: "/admin/register",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_CABS: "/admin/cabs",
  ADMIN_ADD_CAB: "/admin/addcab",
  ADMIN_EDIT_CAB: "/admin/edit/:id",
  ADMIN_BOOKINGS: "/admin/bookings",
};

// ==================== LOCAL STORAGE KEYS ====================
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  ADMIN_TOKEN: "adminToken",
  ADMIN: "admin",
  ROLE: "role",
};

// ==================== PAGINATION ====================
export const ITEMS_PER_PAGE = 10;

// ==================== APP INFO ====================
export const APP_NAME = "Cab Booking System";
export const APP_TAGLINE = "Your Ride, Your Way";