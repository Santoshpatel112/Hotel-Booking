import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number, 
        required: true,
    },
    maxpeople: {
        type: Number, 
        required: true,
    },
    desc: {
        type: String,
    },
    roomNumber: [{ number: Number, unavailableDates: { type: [Date] } }]
}, { timestamps: true });

export const Room = mongoose.model("Room", RoomSchema); 