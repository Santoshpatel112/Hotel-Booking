
import express from "express";
import verifyAdmin from "../utils/VerifyAdmin.js";
import Booking from "../models/Booking.js";
const router = express.Router();

// Admin Dashboard Route
// Admin Dashboard Route
router.get("/admin-dashboard", verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;