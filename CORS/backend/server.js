import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";

// Import DB connection
import { connectDB } from "./config/db.js";

// Load env vars
dotenv.config();

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // Allow JSON body parsing
app.use(cookieParser()); // Parse cookies

// CORS Configuration
// We strictly allow only the frontend URL to send requests
app.use(
  cors({
    origin: process.env.CLIENT_URL, // This must be Vercel URL
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Basic Route for Testing
app.get("/", (req, res) => {
  res.json({ message: "🚀 API is running..." });
});

app.use("/api/auth", authRoutes);
app.use("/api/grievances", grievanceRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(
    `🟢 Server running in ${process.env.NODE_ENV} mode on port ${PORT}...🚀`
  );
});
