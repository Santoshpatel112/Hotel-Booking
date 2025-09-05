import mongoose from 'mongoose';
import { Hotel } from './models/Hotel.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleHotels = [
  {
    name: "Grand Hotel Lucknow",
    type: "hotel",
    city: "Lucknow",
    address: "1234 MG Road, Lucknow, UP",
    distance: "500m from center",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
    ],
    title: "Luxury Hotel in the Heart of Lucknow",
    description: "A beautiful luxury hotel offering world-class amenities and comfortable accommodation in the heart of Lucknow.",
    rating: 4.5,
    rooms: ["room1_id", "room2_id"],
    prices: 3500,
    featured: true
  },
  {
    name: "Delhi Palace Hotel",
    type: "hotel",
    city: "Delhi",
    address: "567 Connaught Place, New Delhi",
    distance: "300m from center",
    photos: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"
    ],
    title: "Premium Hotel in Delhi's Heart",
    description: "Experience luxury and comfort at Delhi Palace Hotel, located in the prime location of Connaught Place.",
    rating: 4.7,
    rooms: ["room3_id", "room4_id"],
    prices: 4200,
    featured: true
  },
  {
    name: "Jaipur Heritage Resort",
    type: "resort",
    city: "Jaipur",
    address: "Pink City Road, Jaipur, Rajasthan",
    distance: "1km from center",
    photos: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
    ],
    title: "Royal Heritage Resort in Pink City",
    description: "Immerse yourself in the royal culture of Rajasthan at our heritage resort in Jaipur.",
    rating: 4.3,
    rooms: ["room5_id", "room6_id"],
    prices: 2800,
    featured: false
  },
  {
    name: "Bangalore Tech Suites",
    type: "apartment",
    city: "Bangalore",
    address: "Electronic City, Bangalore, Karnataka",
    distance: "2km from center",
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800"
    ],
    title: "Modern Apartments for Tech Professionals",
    description: "Comfortable and modern apartments perfect for business travelers and tech professionals visiting Bangalore.",
    rating: 4.1,
    rooms: ["room7_id", "room8_id"],
    prices: 2200,
    featured: true
  },
  {
    name: "Mountain View Villa",
    type: "villa",
    city: "Delhi",
    address: "Greater Noida, Delhi NCR",
    distance: "5km from center",
    photos: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
    ],
    title: "Peaceful Villa Getaway",
    description: "A serene villa perfect for family vacations and peaceful retreats near Delhi.",
    rating: 4.6,
    rooms: ["room9_id", "room10_id"],
    prices: 5500,
    featured: false
  },
  {
    name: "Cozy Cabin Retreat",
    type: "cabin",
    city: "Lucknow",
    address: "Outskirts, Lucknow, UP",
    distance: "10km from center",
    photos: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800"
    ],
    title: "Rustic Cabin Experience",
    description: "Experience nature and tranquility in our cozy cabin retreat on the outskirts of Lucknow.",
    rating: 4.0,
    rooms: ["room11_id", "room12_id"],
    prices: 1800,
    featured: false
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing hotels
    await Hotel.deleteMany({});
    console.log('🧹 Cleared existing hotel data');

    // Insert sample hotels
    const insertedHotels = await Hotel.insertMany(sampleHotels);
    console.log(`🏨 Inserted ${insertedHotels.length} sample hotels`);

    // Log the inserted hotels
    insertedHotels.forEach((hotel, index) => {
      console.log(`  ${index + 1}. ${hotel.name} in ${hotel.city} - ₹${hotel.prices}`);
    });

    await mongoose.connection.close();
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
