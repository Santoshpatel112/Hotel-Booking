import mongoose from "mongoose";
import Hotel from "./models/Hotel.js";

const seedHotels = async () => {
    await mongoose.connect("mongodb://localhost:27017/bookingApp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const hotels = [
        { name: "Luxury Hotel", type: "hotel", image: "hotel.jpg", description: "A luxury hotel." },
        { name: "Cozy Apartment", type: "apartment", image: "apartment.jpg", description: "A cozy apartment." },
        { name: "Beach Resort", type: "resort", image: "resort.jpg", description: "A beach resort." },
        { name: "Mountain Villa", type: "villa", image: "villa.jpg", description: "A mountain villa." },
        { name: "Forest Cabin", type: "cabin", image: "cabin.jpg", description: "A forest cabin." },
    ];

    await Hotel.insertMany(hotels);
    console.log("Seed data inserted.");
    mongoose.connection.close();
};

seedHotels();
