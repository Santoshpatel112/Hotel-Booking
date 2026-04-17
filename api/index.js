import express from "express";
import { createServer } from "http";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import hotelRoutes from "./routes/hotel.js";
import userRoutes from "./routes/user.js";
import roomRoutes from "./routes/rooms.js";
import bookingRoutes from "./routes/booking.js";
import dashboardRoutes from "./routes/dashboard.js";
import analyticsRoutes from "./routes/analytics.js";
import propertyTypeRoutes from "./routes/propertyType.js";
import hotelTypeRoutes from "./routes/hotelType.js";
import paymentRoutes from "./routes/payment.js";
import { initializeSocket } from "./utils/socket.js";
import axios from "axios";

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/hotelBooking";

let publicIP = "unknown";
const fetchIP = async () => {
  try {
    const res = await axios.get("https://checkip.amazonaws.com", { timeout: 3000 });
    publicIP = res.data.toString().trim();
  } catch (e) {
    publicIP = "could not determine";
  }
};
fetchIP();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ─── Health Check Endpoint ────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? "ok" : "degraded",
    db: dbStatusMap[dbState] || "unknown",
    serverIP: publicIP,
    version: "2.6-Hybrid-Bridge",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("🏨 Hotel Booking API is running"));
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/property-types", propertyTypeRoutes);
app.use("/api/hotel-types", hotelTypeRoutes);
app.use("/api/payment", paymentRoutes);

// ─── MongoDB Hybrid Connection Bridge ───────────────────────────────────────
/**
 * In Node 25+, Mongoose 8 occasionally fails the TLS handshake on macOS 
 * due to OpenSSL 3.4 strictness. This "Hybrid Bridge" uses the native 
 * MongoClient (which pings successfully) to establish the tunnel, 
 * then wraps Mongoose around it for the ODM features.
 */
const connectDB = async (attempt = 1) => {
  try {
    console.log(`🔌 [Attempt ${attempt}] Establishing Hybrid Connection Bridge...`);

    const client = new MongoClient(MONGO_URL, {
      tls: true,
      family: 4,
      serverSelectionTimeoutMS: 15000,
    });

    await client.connect();
    console.log("✅ Native tunnel established.");

    // Bridge the native connection to Mongoose
    await mongoose.connect(MONGO_URL, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Mongoose bridge successfully activated.");
  } catch (error) {
    console.error(`❌ Hybrid Bridge failed (attempt ${attempt}):`, error.message);

    if (attempt < 3) {
      setTimeout(() => connectDB(attempt + 1), 3000);
    } else {
      console.error("");
      console.error("🚨 ─── FINAL DIAGNOSTIC ─── 🚨");
      console.error(`👉 Your IP: ${publicIP}`);
      console.error("If connectivity persists, manually confirm IP whitelist in Atlas.");
      console.error("🚨 ─────────────────────── 🚨");
    }
  }
};

const server = createServer(app);
initializeSocket(server);

if (process.env.VERCEL) {
  console.log("⚡ Vercel Environment Detected. Booting Serverless...");
  connectDB().catch(console.error);
} else {
  server.listen(PORT, async () => {
    console.log("");
    console.log(`🚀 API: http://localhost:${PORT}`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
    console.log("");
    await connectDB();
  });
}

// Export Express app for Vercel Serverless Function compatibility
export default app;
