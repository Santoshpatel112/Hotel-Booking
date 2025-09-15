import mongoose from "mongoose";
import Hotel from "./models/Hotel.js";
import { User } from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/easystay", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("🔗 Connected to MongoDB for seeding...");

        // Seed Hotels
        const existingHotels = await Hotel.countDocuments();
        if (existingHotels === 0) {
            const hotels = [
                { 
                    name: "Luxury Hotel Mumbai", 
                    type: "hotel", 
                    city: "Mumbai",
                    country: "India",
                    address: "Marine Drive, Mumbai",
                    photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
                    description: "A luxury hotel in the heart of Mumbai.",
                    rating: 4.5,
                    prices: 5000,
                    cheapestPrice: 5000,
                    featured: true
                },
                { 
                    name: "Cozy Apartment Delhi", 
                    type: "apartment", 
                    city: "Delhi",
                    country: "India",
                    address: "Connaught Place, Delhi",
                    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
                    description: "A cozy apartment in central Delhi.",
                    rating: 4.2,
                    prices: 3000,
                    cheapestPrice: 3000
                },
                { 
                    name: "Beach Resort Goa", 
                    type: "resort", 
                    city: "Goa",
                    country: "India",
                    address: "Calangute Beach, Goa",
                    photos: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"],
                    description: "A beautiful beach resort in Goa.",
                    rating: 4.8,
                    prices: 8000,
                    cheapestPrice: 8000,
                    featured: true
                },
                { 
                    name: "Mountain Villa Shimla", 
                    type: "villa", 
                    city: "Shimla",
                    country: "India",
                    address: "Mall Road, Shimla",
                    photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6"],
                    description: "A mountain villa with scenic views.",
                    rating: 4.6,
                    prices: 6000,
                    cheapestPrice: 6000
                },
                { 
                    name: "Forest Cabin Manali", 
                    type: "cabin", 
                    city: "Manali",
                    country: "India",
                    address: "Old Manali, Himachal Pradesh",
                    photos: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000"],
                    description: "A peaceful forest cabin in Manali.",
                    rating: 4.3,
                    prices: 4500,
                    cheapestPrice: 4500
                },
            ];

            await Hotel.insertMany(hotels);
            console.log("✅ Hotel seed data inserted.");
        } else {
            console.log("📋 Hotels already exist, skipping hotel seeding.");
        }

        // Seed Admin Users
        const adminAccounts = [
            {
                username: "admin123",
                email: "admin123@gmail.com",
                password: "admin123",
                isAdmin: true
            },
            {
                username: "santoshpatelvns5",
                email: "santoshpatelvns5@gmail.com",
                password: "your_password_here", // Replace with actual password
                isAdmin: true
            },
            {
                username: "easystay_admin",
                email: "admin@easystay.com",
                password: "admin123",
                isAdmin: true
            },
            {
                username: "booking_admin",
                email: "admin@booking.com",
                password: "admin123",
                isAdmin: true
            }
        ];

        for (const adminData of adminAccounts) {
            const existingUser = await User.findOne({ email: adminData.email });
            if (!existingUser) {
                const hashPassword = await bcrypt.hash(adminData.password, 10);
                const adminUser = new User({
                    username: adminData.username,
                    email: adminData.email,
                    password: hashPassword,
                    isAdmin: true,
                });
                await adminUser.save();
                console.log(`✅ Admin user created: ${adminData.email}`);
            } else {
                console.log(`📋 Admin user already exists: ${adminData.email}`);
                // Update admin status if not set
                if (!existingUser.isAdmin) {
                    await User.findByIdAndUpdate(existingUser._id, { isAdmin: true });
                    console.log(`🔄 Updated admin status for: ${adminData.email}`);
                }
            }
        }

        console.log("🎉 Database seeding completed!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Seeding error:", error);
        mongoose.connection.close();
    }
};

seedDatabase();
