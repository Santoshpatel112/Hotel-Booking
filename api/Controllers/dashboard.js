import { Hotel } from "../models/Hotel.js";
import User, { User as UserNamed } from "../models/User.js";
import { Room } from "../models/Room.js";

// Get dashboard overview data
export const getDashboardOverview = async (req, res) => {
  try {
    // Get total counts
    const totalHotels = await Hotel.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Calculate total revenue (sum of all room prices * bookings)
    const hotels = await Hotel.find().populate('rooms');
    let totalRevenue = 0;
    let totalBookings = 0;
    
    hotels.forEach(hotel => {
      hotel.rooms.forEach(room => {
        if (room.bookings && room.bookings.length > 0) {
          room.bookings.forEach(booking => {
            totalRevenue += booking.totalPrice || 0;
            totalBookings++;
          });
        }
      });
    });

    // Get recent activity (mock data for now - implement activity logging later)
    const recentActivity = [
      {
        id: 1,
        action: "New hotel added",
        description: "Grand Palace Hotel",
        time: "2 min ago",
        type: "hotel"
      },
      {
        id: 2,
        action: "Booking confirmed",
        description: "Room 205 - 3 nights",
        time: "5 min ago",
        type: "booking"
      },
      {
        id: 3,
        action: "User registered",
        description: "john.doe@example.com",
        time: "10 min ago",
        type: "user"
      },
      {
        id: 4,
        action: "Revenue updated",
        description: `₹${(totalRevenue * 0.1).toLocaleString()} added`,
        time: "1 hour ago",
        type: "revenue"
      }
    ];

    // Monthly performance metrics (mock data - implement real calculations later)
    const monthlyPerformance = {
      occupancyRate: 78,
      customerSatisfaction: 4.6,
      bookingConversion: 12.8
    };

    res.json({
      totalRevenue,
      totalHotels,
      totalBookings,
      totalUsers,
      recentActivity,
      monthlyPerformance
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Get hotels list
export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('rooms');
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
};

// Create new hotel
export const createHotel = async (req, res) => {
  try {
    const { name, description, location, amenities, images, contactInfo } = req.body;
    
    const hotel = new Hotel({
      name,
      description,
      location,
      amenities,
      images,
      contactInfo,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await hotel.save();
    
    // Log activity
    console.log(`New hotel created: ${name}`);
    
    res.status(201).json(hotel);
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: 'Failed to create hotel' });
  }
};

// Update hotel
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    const hotel = await Hotel.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json(hotel);
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Failed to update hotel' });
  }
};

// Delete hotel
export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    
    const hotel = await Hotel.findByIdAndDelete(id);
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
};

// Get users list
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = new User({
      username,
      email,
      password,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    // Don't allow password updates through this endpoint
    delete updateData.password;
    
    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get bookings
export const getBookings = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate({
      path: 'rooms',
      populate: {
        path: 'bookings',
        model: 'Booking'
      }
    });
    
    // Flatten bookings from all hotels and rooms
    const allBookings = [];
    hotels.forEach(hotel => {
      hotel.rooms.forEach(room => {
        if (room.bookings && room.bookings.length > 0) {
          room.bookings.forEach(booking => {
            allBookings.push({
              ...booking.toObject(),
              hotelName: hotel.name,
              roomNumber: room.roomNumber
            });
          });
        }
      });
    });
    
    res.json(allBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get revenue data
export const getRevenue = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('rooms');
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let weeklyRevenue = 0;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    hotels.forEach(hotel => {
      hotel.rooms.forEach(room => {
        if (room.bookings && room.bookings.length > 0) {
          room.bookings.forEach(booking => {
            const bookingDate = new Date(booking.checkIn);
            totalRevenue += booking.totalPrice || 0;
            
            if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
              monthlyRevenue += booking.totalPrice || 0;
            }
            
            if (bookingDate >= oneWeekAgo) {
              weeklyRevenue += booking.totalPrice || 0;
            }
          });
        }
      });
    });
    
    res.json({
      totalRevenue,
      monthlyRevenue,
      weeklyRevenue,
      lastMonthRevenue: totalRevenue - monthlyRevenue // Simplified calculation
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
};

// Get analytics data
export const getAnalytics = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('rooms');
    
    // Calculate occupancy rate
    let totalRooms = 0;
    let occupiedRooms = 0;
    
    hotels.forEach(hotel => {
      hotel.rooms.forEach(room => {
        totalRooms++;
        if (room.bookings && room.bookings.length > 0) {
          const hasActiveBooking = room.bookings.some(booking => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            const now = new Date();
            return now >= checkIn && now <= checkOut;
          });
          if (hasActiveBooking) occupiedRooms++;
        }
      });
    });
    
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
    
    res.json({
      occupancyRate: Math.round(occupancyRate),
      totalHotels: hotels.length,
      totalRooms,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
};

export default {
  getDashboardOverview,
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getBookings,
  getRevenue,
  getAnalytics,
};
