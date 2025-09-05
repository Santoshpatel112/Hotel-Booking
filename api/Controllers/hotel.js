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
    return res.status(200).json({ hotel: getHotel });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Unable to find Somthing error " }, error);
  }
};

const getallHotel = async (req, res) => {
  const { city, type, min, max, limit ,...others} = req.query;
  try {
    const getall = await Hotel.find({
      ...others,
      cheapestprice: { $gt: min || 1, $lt: max || 999 }
    }).limit(limit);
    console.log(`📊 Found ${getall.length} hotels in database`);

    if (getall.length > 0) {
      console.log("🏨 Hotels found:");
      getall.forEach((hotel, index) => {
        console.log(`  ${index + 1}. ${hotel.name} in ${hotel.city}`);
      });
    } else {
      console.log("⚠️ No hotels found in database");
    }

    return res.status(200).json({ hotels: getall });
  } catch (err) {
    console.error("❌ Error fetching hotels:", err);
    return res
      .status(500)
      .json({ message: "Unable to find hotels", error: err.message });
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

const CountByType=async (req,res)=>{
  try {
    const HotelCount=await Hotel.countDocuments({type:"hotel"});
  const apartmentCount=await Hotel.countDocuments({type:"apartment"});
  const resortCount=await Hotel.countDocuments({type:"resort"});
  const villaCount=await Hotel.countDocuments({type:"villa"});
  const cabinCount= await Hotel.countDocuments({type:"cabin"});
  
  res.status(200).json([
    {type:"hotel",count:HotelCount},
    {type:"apartment",count:apartmentCount},
    {type:"resort",count:resortCount},
    {type:"villa",count:villaCount},
    {type:"cabin",count:cabinCount},
  ])
  } catch (error) {
    return res.status(500).json({
      message: "Unable to count by type",
      error: error.message,
    });
  }
}
const getFeaturedHotels = async (req, res) => {
  try {
    const { featured, limit } = req.query;
    const hotels = await Hotel.find({ featured: featured === 'true' })
      .limit(parseInt(limit) || 4);
    
    return res.status(200).json(hotels);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching featured hotels",
      error: error.message
    });
  }
};

// Add to exports at the bottom:
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
