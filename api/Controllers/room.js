import { Room } from "../models/Room.js";
import { Hotel } from "../models/Hotel.js";

// CREATE ROOM
export const CreateRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const { title, price, maxpeople } = req.body;

  console.log("🛏️ Creating room for hotel ID:", hotelId);
  console.log("📝 Room data:", { title, price, maxpeople });

  if (!title || !price || !maxpeople) {
    console.log("⚠️ Missing required fields for room creation");
    return res.status(400).json({
      status: 400,
      message: "All fields must be required",
    });
  }

  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    console.log("✅ Room saved successfully:", savedRoom._id);
    console.log("🛏️ Room title:", savedRoom.title);
    console.log("💰 Room price:", savedRoom.price);

    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
      console.log("🔗 Room linked to hotel:", hotelId);
    } catch (err) {
      console.error("❌ Failed to link room to hotel:", err.message);
      next(err);
    }

    return res.status(201).json({
      status: 201,
      message: "Room Created Successfully",
      room: savedRoom,
    });
  } catch (error) {
    console.error("❌ Room creation error:", error.message);
    return res.status(500).json({
      error: error.message,
      message: "Something Error Occurred: Unable to Create Room Failed",
    });
  }
};

// UPDATE ROOM
export const UpdateRoom = async (req, res) => {
  const { title, price, maxpeople } = req.body;

  console.log("🔄 Updating room with ID:", req.params.id);
  console.log("📝 Update data:", { title, price, maxpeople });

  if (!title || !price || !maxpeople) {
    console.log("⚠️ Missing required fields for room update");
    return res.status(400).json({
      status: 400,
      message: "All fields must be required",
    });
  }

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedRoom) {
      console.log("❌ Room not found for update:", req.params.id);
      return res.status(404).json({
        status: 404,
        message: "Room not found",
      });
    }

    console.log("✅ Room updated successfully:", updatedRoom._id);
    console.log("🛏️ Updated title:", updatedRoom.title);
    console.log("💰 Updated price:", updatedRoom.price);

    return res.status(200).json({
      status: 200,
      message: "Room Updated Successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("❌ Room update error:", error.message);
    return res.status(500).json({
      status: 500,
      message: "Something Error Occurred: Unable to Update Room Failed",
      error: error.message,
    });
  }
};

// DELETE ROOM
export const DeleteRoom = async (req, res) => {
  const hotelId = req.params.hotelid;

  console.log("🗑️ Deleting room with ID:", req.params.id);
  console.log("🏨 From hotel ID:", hotelId);

  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      console.log("❌ Room not found for deletion:", req.params.id);
      return res.status(404).json({
        status: 404,
        message: "Room not found",
      });
    }

    // Find the hotel and pull the room's ID from its rooms array
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
      console.log("🔗 Room unlinked from hotel:", hotelId);
    } catch (err) {
      console.error("⚠️ Failed to unlink room from hotel:", err.message);
    }

    console.log("✅ Room deleted successfully:", deletedRoom._id);
    console.log("🛏️ Deleted room:", deletedRoom.title);

    return res.status(200).json({
      status: 200,
      message: "Room Deleted Successfully",
    });
  } catch (error) {
    console.error("❌ Room deletion error:", error.message);
    return res.status(500).json({
      status: 500,
      message: "Something Error Occurred: Unable to Delete Room Failed",
      error: error.message,
    });
  }
};

// GET ROOM BY ID
export const GetRoomByID = async (req, res) => {
  try {
    console.log("🔍 Fetching room with ID:", req.params.id);

    const room = await Room.findById(req.params.id);

    if (!room) {
      console.log("❌ Room not found:", req.params.id);
      return res.status(404).json({
        status: 404,
        message: "Room not found",
      });
    }

    console.log("✅ Room found:", room.title);
    console.log("💰 Price:", room.price);
    console.log("👥 Max people:", room.maxpeople);

    return res.status(200).json({
      status: 200,
      room: room,
    });
  } catch (error) {
    console.error("❌ Get room error:", error.message);
    return res.status(500).json({
      status: 500,
      message: "Something Error Occurred: Unable to Find Room",
      error: error.message,
    });
  }
};

// GET ALL ROOMS
export const GetAllRooms = async (req, res) => {
  try {
    console.log("🛏️ Fetching all rooms...");

    const allRooms = await Room.find();

    console.log(`📊 Found ${allRooms.length} rooms in database`);

    if (allRooms.length > 0) {
      console.log("🛏️ Rooms found:");
      allRooms.forEach((room, index) => {
        console.log(
          `  ${index + 1}. ${room.title} - ₹${room.price} (Max: ${
            room.maxpeople
          })`
        );
      });
    } else {
      console.log("⚠️ No rooms found in database");
    }

    return res.status(200).json({
      status: 200,
      rooms: allRooms,
    });
  } catch (error) {
    console.error("❌ Get all rooms error:", error.message);
    return res.status(500).json({
      status: 500,
      message: "Something Error Occurred: Unable to Find Rooms",
      error: error.message,
    });
  }
};
