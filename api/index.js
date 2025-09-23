import express from "express";
import { createServer } from 'http';
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
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








dotenv.config();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        
        const dbName = mongoose.connection.db.databaseName;
        const host = mongoose.connection.host;
        
        if (host === 'localhost' || host === '127.0.0.1') {
            console.log(`✅ Connected to Local MongoDB - Database: ${dbName}`);
        } else {
            console.log(`✅ Connected to MongoDB Atlas - Database: ${dbName}`);
        }
        
        console.log(`🔗 Connection URL: ${host}:${mongoose.connection.port}/${dbName}`);
        
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        console.log("💡 Please check your MongoDB setup");
        process.exit(1);
    }
}

mongoose.connection.on("disconnected",()=>{
    console.log("MongoDB disconnected");
})
mongoose.connection.on("connected",()=>{
    console.log("MongoDB connected");
})

app.get('/', (req, res) => {
    res.send("Hello World");
  });


app.use("/api/auth",authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/users",userRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/property-types", propertyTypeRoutes);
app.use("/api/hotel-types", hotelTypeRoutes);
app.use("/api/payment", paymentRoutes);
app.use((err, req, res, next) => {
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? err.stack : {}
    });
});
const server = createServer(app);

initializeSocket(server);

server.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 WebSocket server ready for real-time updates`);
  await connectDB();
});
