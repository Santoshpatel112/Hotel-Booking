import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
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
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        // Check which database we're connected to
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

// mongoose.connection.on("disconnected",()=>{
//     console.log("MongoDB disconnected");
// })
// mongoose.connection.on("connected",()=>{
//     console.log("MongoDB connected");
// })

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

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


    // ... existing code ...
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
// ... existing code ...

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
//   connectDB();
});