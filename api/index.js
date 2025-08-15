import express from "express";
const app = express();
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import hotelRoutes from "./routes/hotel.js";
import userRoutes from "./routes/user.js";
import roomRoutes from "./routes/rooms.js";

dotenv.config();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        console.log("🔧 Trying to connect to local MongoDB...");
        
        // Fallback to local MongoDB
        try {
            await mongoose.connect("mongodb://localhost:27017/easystay");
            console.log("✅ Connected to Local MongoDB");
        } catch (localError) {
            console.error("❌ Local MongoDB also failed:", localError.message);
            console.log("💡 Please check your MongoDB setup");
        }
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

// middleware
// Your error handling middleware or catch block
app.use((err, req, res, next) => {
    // A. Define a default status code and message for unknown errors
    const errorStatus = err.status || 500; // Use the error's status if it exists, otherwise default to 500 (Internal Server Error)
    const errorMessage = err.message || "Something went wrong!"; // Use the error's message if it exists, otherwise a generic message

 // B. Send the response with the defined status and message
return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? err.stack : {} // Optional: Show the stack trace in development
    });
});
app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

