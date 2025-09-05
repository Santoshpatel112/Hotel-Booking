import { Booking } from "../models/Booking.js";
import { Hotel } from "../models/Hotel.js";
import { User } from "../models/User.js";

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const {
            hotelId,
            checkInDate,
            checkOutDate,
            guests,
            rooms,
            guestDetails,
            paymentMethod,
            specialRequests
        } = req.body;

        // Validate dates
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn < today) {
            return res.status(400).json({
                success: false,
                message: "Check-in date cannot be in the past"
            });
        }

        if (checkOut <= checkIn) {
            return res.status(400).json({
                success: false,
                message: "Check-out date must be after check-in date"
            });
        }

        // Check if hotel exists
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        // Calculate pricing
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const basePrice = hotel.prices * rooms * nights;
        const taxes = basePrice * 0.18; // 18% GST
        const fees = basePrice * 0.05; // 5% service fee
        const totalPrice = basePrice + taxes + fees;

        // Create booking
        const newBooking = new Booking({
            user: req.user.id,
            hotel: hotelId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guests,
            rooms,
            totalPrice,
            priceBreakdown: {
                basePrice,
                taxes,
                fees,
                discount: 0
            },
            guestDetails: {
                ...guestDetails,
                specialRequests: specialRequests || ''
            },
            paymentMethod,
            nights,
            metadata: {
                deviceInfo: req.headers['user-agent'],
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            }
        });

        const savedBooking = await newBooking.save();
        
        // Populate the booking with hotel and user details
        const populatedBooking = await Booking.findById(savedBooking._id)
            .populate('hotel', 'name city address photos')
            .populate('user', 'username email');

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: populatedBooking
        });

    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: error.message
        });
    }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, paymentStatus, hotel, user } = req.query;
        
        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (hotel) filter.hotel = hotel;
        if (user) filter.user = user;

        const bookings = await Booking.find(filter)
            .populate('user', 'username email')
            .populate('hotel', 'name city address')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Booking.countDocuments(filter);

        res.status(200).json({
            success: true,
            bookings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalBookings: total
        });

    } catch (error) {
        console.error("Get bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        const filter = { user: userId };
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate('hotel', 'name city address photos prices rating')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            bookings
        });

    } catch (error) {
        console.error("Get user bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user bookings",
            error: error.message
        });
    }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate('user', 'username email phone')
            .populate('hotel', 'name city address photos prices rating description');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Check if user can access this booking
        if (booking.user._id.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {
        console.error("Get booking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch booking",
            error: error.message
        });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus } = req.body;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Update fields
        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        await booking.save();

        const updatedBooking = await Booking.findById(id)
            .populate('hotel', 'name city')
            .populate('user', 'username email');

        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            booking: updatedBooking
        });

    } catch (error) {
        console.error("Update booking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update booking",
            error: error.message
        });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Check if user can cancel this booking
        if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Check if booking is cancellable
        if (!booking.cancellation.isCancellable) {
            return res.status(400).json({
                success: false,
                message: "This booking cannot be cancelled"
            });
        }

        // Update booking
        booking.status = 'cancelled';
        booking.cancellation.cancelledAt = new Date();
        booking.cancellation.cancelledBy = req.user.id;
        booking.cancellation.cancellationReason = reason || 'Cancelled by user';

        // Calculate refund amount (simplified logic)
        const checkInDate = new Date(booking.checkInDate);
        const today = new Date();
        const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));

        let refundAmount = 0;
        if (daysUntilCheckIn > 7) {
            refundAmount = booking.totalPrice * 0.9; // 90% refund
        } else if (daysUntilCheckIn > 3) {
            refundAmount = booking.totalPrice * 0.5; // 50% refund
        } else {
            refundAmount = 0; // No refund
        }

        booking.cancellation.refundAmount = refundAmount;
        booking.paymentStatus = refundAmount > 0 ? 'refunded' : booking.paymentStatus;

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            refundAmount,
            booking
        });

    } catch (error) {
        console.error("Cancel booking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel booking",
            error: error.message
        });
    }
};

// Get booking statistics (admin only)
export const getBookingStats = async (req, res) => {
    try {
        // Total bookings
        const totalBookings = await Booking.countDocuments();

        // Bookings by status
        const statusStats = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Revenue statistics
        const revenueStats = await Booking.aggregate([
            {
                $match: { paymentStatus: { $in: ['paid', 'partial'] } }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    averageBookingValue: { $avg: "$totalPrice" }
                }
            }
        ]);

        // Monthly bookings
        const monthlyBookings = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            },
            {
                $limit: 12
            }
        ]);

        // Top hotels by bookings
        const topHotels = await Booking.aggregate([
            {
                $group: {
                    _id: "$hotel",
                    bookingCount: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            {
                $lookup: {
                    from: "hotels",
                    localField: "_id",
                    foreignField: "_id",
                    as: "hotel"
                }
            },
            {
                $unwind: "$hotel"
            },
            {
                $sort: { bookingCount: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalBookings,
                statusStats,
                revenue: revenueStats[0] || { totalRevenue: 0, averageBookingValue: 0 },
                monthlyBookings,
                topHotels
            }
        });

    } catch (error) {
        console.error("Get booking stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch booking statistics",
            error: error.message
        });
    }
};

// Check room availability
export const checkAvailability = async (req, res) => {
    try {
        const { hotelId, checkInDate, checkOutDate, rooms } = req.query;

        if (!hotelId || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                success: false,
                message: "Hotel ID, check-in date, and check-out date are required"
            });
        }

        // Check for conflicting bookings
        const conflictingBookings = await Booking.find({
            hotel: hotelId,
            status: { $nin: ['cancelled'] },
            $or: [
                {
                    checkInDate: { $lt: new Date(checkOutDate) },
                    checkOutDate: { $gt: new Date(checkInDate) }
                }
            ]
        });

        // Calculate booked rooms for the period
        const bookedRooms = conflictingBookings.reduce((total, booking) => {
            return total + booking.rooms;
        }, 0);

        // Get hotel info (assuming max rooms available)
        const hotel = await Hotel.findById(hotelId);
        const maxRooms = 10; // This should come from hotel schema
        const availableRooms = Math.max(0, maxRooms - bookedRooms);

        const isAvailable = availableRooms >= (parseInt(rooms) || 1);

        res.status(200).json({
            success: true,
            available: isAvailable,
            availableRooms,
            bookedRooms,
            requestedRooms: parseInt(rooms) || 1
        });

    } catch (error) {
        console.error("Check availability error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check availability",
            error: error.message
        });
    }
};

export default {
    createBooking,
    getAllBookings,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    getBookingStats,
    checkAvailability
};
