import mongoose from "mongoose";
import { Hotel } from "../models/Hotel.js";

const CreateHotel = async (req, res) => {
  try {
    console.log("🏨 Creating hotel with data:", req.body);

    const newHotel = new Hotel(req.body);
    const saveHotel = await newHotel.save();

    console.log("✅ Hotel saved successfully:", saveHotel._id);
    console.log("📍 Hotel city:", saveHotel.city);
    console.log("🏨 Hotel name:", saveHotel.name);

    return res
      .status(201)
      .json({ message: "Hotel created successfully", hotel: saveHotel });
  } catch (error) {
    console.error("❌ Hotel creation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const UpdateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel doesn't exist" });
    }
    const updateHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Hotel Updated Successfully", hotel: updateHotel });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ message: "Unable to update", error: error.message });
  }
};

const DeleteHotel = async (req, res) => {
  try {
    const deleteHotel = await Hotel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Hotel Deleted Successfully", deleteHotel });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete it somthing error happpend",
      error,
    });
  }
};

const GetHotelByID = async (req, res) => {
  try {
    const getHotel = await Hotel.findById(req.params.id);
    if (!getHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const transformedHotel = {
      ...getHotel.toObject(),
      cheapestPrice: getHotel.prices,
      cheapestprice: getHotel.prices,
      desc: getHotel.description,
    };

    return res.status(200).json({ hotel: transformedHotel });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Unable to find hotel", error: error.message });
  }
};

const getallHotel = async (req, res) => {
  // DB Connectivity Check
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database connection is currently unavailable. Please try again in a moment.",
      data: [],
      hotels: [],
      count: 0
    });
  }

  const { city, type, min, max, limit, sortBy, ...others } = req.query;
  try {
    let query = {};

    if (city) {
      query.city = { $regex: new RegExp(city, "i") };
    }

    if (type) {
      query.type = type;
    }

    if (min || max) {
      query.prices = {
        $gte: parseInt(min) || 1,
        $lte: parseInt(max) || 999999,
      };
    }

    Object.keys(others).forEach((key) => {
      if (
        others[key] &&
        key !== "city" &&
        key !== "type" &&
        key !== "min" &&
        key !== "max" &&
        key !== "sortBy"
      ) {
        query[key] = others[key];
      }
    });

    console.log(`🔍 Search query:`, query);
    console.log(`📍 City filter: ${city}`);
    console.log(`💰 Price range: ${min || "any"} - ${max || "any"}`);

    let sortCriteria = {};
    switch (sortBy) {
      case "price_low":
        sortCriteria = { prices: 1 };
        break;
      case "price_high":
        sortCriteria = { prices: -1 };
        break;
      case "rating":
        sortCriteria = { rating: -1 };
        break;
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      default:
        sortCriteria = { featured: -1, rating: -1 };
    }

    const getall = await Hotel.find(query)
      .sort(sortCriteria)
      .limit(parseInt(limit) || 0);

    console.log(`📊 Found ${getall.length} hotels in database`);

    if (getall.length > 0) {
      console.log("🏨 Hotels found:");
      getall.forEach((hotel, index) => {
        console.log(
          `  ${index + 1}. ${hotel.name} in ${hotel.city} - ₹${hotel.prices}`
        );
      });
    } else {
      console.log("⚠️ No hotels found matching criteria");
      console.log(`   Query used:`, JSON.stringify(query, null, 2));
    }

    const transformedHotels = getall.map((hotel) => ({
      ...hotel.toObject(),
      cheapestPrice: hotel.prices,
      cheapestprice: hotel.prices,
      desc: hotel.description,
      rating: hotel.rating || 4.0,
      amenities: hotel.amenities || [],
      photos: hotel.photos || [],
    }));

    return res.status(200).json({
      data: transformedHotels,
      hotels: transformedHotels,
      count: transformedHotels.length,
      query: query,
      sortBy: sortBy,
    });
  } catch (err) {
    console.error("❌ Error fetching hotels:", err);
    return res.status(500).json({
      message: "Unable to find hotels",
      error: err.message,
      data: [],
      hotels: [],
      count: 0,
    });
  }
};

const countByCity = async (req, res) => {
  try {
    const cities = req.query.cities.split(",");

    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city.trim() });
      })
    );

    return res.status(200).json(list);
  } catch (error) {
    console.error("Count by city error:", error);
    return res.status(500).json({
      status: 500,
      message: "Unable to count hotels by city",
      error: error.message,
    });
  }
};
const countByCityDetailed = async (req, res) => {
  try {
    const cities = req.query.cities.split(",");

    const results = await Promise.all(
      cities.map(async (city) => {
        const trimmedCity = city.trim();
        const count = await Hotel.countDocuments({ city: trimmedCity });
        return {
          city: trimmedCity,
          count: count,
        };
      })
    );

    return res.status(200).json(results);
  } catch (error) {
    console.error("Count by city detailed error:", error);
    return res.status(500).json({
      status: 500,
      message: "Unable to count hotels by city",
      error: error.message,
    });
  }
};

const testDatabase = async (req, res) => {
  try {
    const mongoose = (await import("mongoose")).default;
    const dbName = mongoose.connection.db.databaseName;
    const host = mongoose.connection.host;
    const port = mongoose.connection.port;
    const readyState = mongoose.connection.readyState;

    const hotelCount = await Hotel.countDocuments();
    const allHotels = await Hotel.find({}, "name city");

    return res.status(200).json({
      database: {
        name: dbName,
        host: host,
        port: port,
        status: readyState === 1 ? "Connected" : "Disconnected",
      },
      hotels: {
        count: hotelCount,
        list: allHotels,
      },
    });
  } catch (error) {
    console.error("❌ Database test error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Database test failed",
    });
  }
};

const CountByType = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json([{ type: "hotel", count: 0 }, { type: "apartment", count: 0 }, { type: "resort", count: 0 }, { type: "villa", count: 0 }, { type: "cabin", count: 0 }]);
  }
  try {
    const HotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: HotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
    ]);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to count by type",
      error: error.message,
    });
  }
};
const getFeaturedHotels = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database connection unavailable", data: [] });
  }
  try {
    const { limit } = req.query;
    const featuredHotels = await Hotel.find({ featured: true }).limit(
      parseInt(limit) || 4
    );

    if (!featuredHotels || featuredHotels.length === 0) {
      return res.status(404).json({ message: "No featured hotels found" });
    }

    return res.status(200).json(featuredHotels);
  } catch (error) {
    console.error("Featured hotels error:", error);
    return res.status(500).json({
      message: "Error fetching featured hotels",
      error: error.message,
    });
  }
};

export default {
  CreateHotel,
  DeleteHotel,
  UpdateHotel,
  GetHotelByID,
  getallHotel,
  countByCity,
  countByCityDetailed,
  testDatabase,
  CountByType,
  getFeaturedHotels,
};
