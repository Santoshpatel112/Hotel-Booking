import { Room } from "../models/Room.js";
import { Hotel } from "../models/Hotel.js";

// CREATE ROOM
export const CreateRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const { title, price, maxpeople } = req.body;

  if (!title || !price || !maxpeople) {
    return res.status(400).json({
      status: 400,
      message: "All fields must be required",
    });
  }

  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();

    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }

    return res.status(201).json({
      status: 201,
      message: "Room Created Successfully",
      room: savedRoom,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Something Error Occurred: Unable to Create Room Failed",
    });
  }
};

// UPDATE ROOM
export const UpdateRoom = async (req, res) => {
  const { title, price, maxpeople } = req.body;
  if (!title || !price || !maxpeople) {
    return res.status(400).json({
      status: 400,
      message: "All fields must be required",
    });
  }

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // Return the updated document
    );

    if (!updatedRoom) {
      return res.status(404).json({
        status: 404,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Room Updated Successfully",
      room: updatedRoom,
    });
  } catch (error) {
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
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    // Find the hotel and pull the room's ID from its rooms array
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      // You might want to handle this more gracefully
    }

    if (!deletedRoom) {
      return res.status(404).json({
        status: 404,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Room Deleted Successfully",
    });
  } catch (error) {
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
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        status: 404,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      status: 200,
      room: room,
    });
  } catch (error) {
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
    const allRooms = await Room.find();

    return res.status(200).json({
      status: 200,
      rooms: allRooms,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something Error Occurred: Unable to Find Rooms",
      error: error.message,
    });
  }
};
