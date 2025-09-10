const express = require("express");
const router = express.Router();
const verifyAdmin = require("../utils/VerifyAdmin");
const Booking = require("../models/Booking");

// Admin dashboard route
router.get("/admin-dashboard", verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find(); // Example: Fetch all bookings
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;