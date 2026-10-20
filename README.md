# 🚖 CAB BOOKING SYSTEM (MERN Stack)

A full-stack Cab Booking Web Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).  
This project allows users to book cabs online and admins to manage cars, users, and bookings efficiently.


## 📖 Project Description

The CAB BOOKING SYSTEM is a web-based application that provides an easy and efficient way for users to book cabs online.  
It includes authentication, booking management, and admin dashboard functionality.

This project demonstrates full-stack development skills including:
- REST API development
- Authentication & Authorization
- Database integration
- Admin panel functionality
- Responsive frontend UI



## 🛠️ Tech Stack

### 🔹 Frontend
- React.js
- Vite
- CSS
- Axios
- React Router

### 🔹 Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- dotenv



## ✨ Features
User Registration
User Login
User Profile
Cab List
Cab Details
Book a Cab
Pickup Location
Destination
Date & Time
Fare calculation
Booking Confirmation 
My Bookings
Cancle Booking
Booking Status
Payment
Driver Details
Admin Dashboard
Driver Management
Cab Management
Booking Management




## 🗂️ Project Structure
CAB-BOOKING/
│
├── client/ # React Frontend
├── server/ # Node + Express Backend
├── .gitignore
└── README.md

## Production deployment (Render)

- Deploy `server/` as a Render **Web Service** running `npm start`. Its root URL must serve the Express API, not the client’s Vite HTML.
- Set `CLIENT_ORIGIN` on the backend to the deployed frontend origin, for example `https://cab-booking-system-client.onrender.com`.
- Set `VITE_API_URL` on the frontend to the backend API root, including `/api`, for example `https://<backend-web-service>.onrender.com/api`, then redeploy the frontend. The current `cab-booking-system-6.onrender.com` URL serves the frontend and must not be used as the API URL.
- For local development, `VITE_API_URL` can be omitted; it defaults to `http://localhost:8000/api`.

## 👩‍💻 Author

**Siddhi Kalsulkar**  
Siddhi Kalsulkar TY Bsc Computer Science MERN Project

GitHub: https://github.com/siddhi-kalsulkar09

## ⭐ If you like this project

Give it a ⭐ on GitHub!
