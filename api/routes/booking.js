import express from "express";
import {
    createBooking,
    getAllBookings,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    getBookingStats,
    checkAvailability
} from "../Controllers/booking.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/Verifytoken.js";

const router = express.Router();

// Public routes
router.get("/check-availability", checkAvailability);

// User routes (require authentication)
router.post("/", verifyToken, createBooking);
router.get("/my-bookings", verifyToken, getUserBookings);
router.get("/:id", verifyToken, getBookingById);
router.put("/:id/cancel", verifyToken, cancelBooking);

// Admin routes
router.get("/", verifyAdmin, getAllBookings);
router.put("/:id/status", verifyAdmin, updateBookingStatus);
router.get("/admin/stats", verifyAdmin, getBookingStats);

export default router;
