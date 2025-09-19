import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Real-time Socket.IO Server Setup
 * Handles WebSocket connections for live dashboard updates
 */

let io;
const connectedUsers = new Map();

// Initialize Socket.IO server
export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Authentication middleware for Socket.IO
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            
            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.userId = user._id.toString();
            socket.isAdmin = user.isAdmin;
            socket.username = user.username;
            
            next();
        } catch (error) {
            console.error('Socket authentication error:', error);
            next(new Error('Authentication error: Invalid token'));
        }
    });

    // Handle connection events
    io.on('connection', (socket) => {
        console.log(`🔌 User connected: ${socket.username} (${socket.userId})`);
        
        // Store connected user info
        connectedUsers.set(socket.userId, {
            socketId: socket.id,
            username: socket.username,
            isAdmin: socket.isAdmin,
            connectedAt: new Date()
        });

        // Join admin room if user is admin
        if (socket.isAdmin) {
            socket.join('admin-dashboard');
            console.log(`👑 Admin ${socket.username} joined dashboard room`);
            
            // Send current dashboard stats on connection
            emitDashboardUpdate();
        }

        // Handle dashboard subscription
        socket.on('subscribe-dashboard', () => {
            if (socket.isAdmin) {
                socket.join('admin-dashboard');
                emitDashboardUpdate();
            }
        });

        // Handle real-time data requests
        socket.on('request-live-data', () => {
            if (socket.isAdmin) {
                emitLiveMetrics();
            }
        });

        // Handle manual dashboard refresh
        socket.on('refresh-dashboard', () => {
            if (socket.isAdmin) {
                emitDashboardUpdate();
                socket.emit('dashboard-refreshed', { timestamp: new Date() });
            }
        });

        // Handle user disconnect
        socket.on('disconnect', (reason) => {
            console.log(`🔌 User disconnected: ${socket.username} (${reason})`);
            connectedUsers.delete(socket.userId);
            
            // Notify other admins about admin disconnect
            if (socket.isAdmin) {
                socket.to('admin-dashboard').emit('admin-disconnected', {
                    username: socket.username,
                    timestamp: new Date()
                });
            }
        });

        // Handle errors
        socket.on('error', (error) => {
            console.error(`Socket error for user ${socket.username}:`, error);
        });
    });

    console.log('✅ Socket.IO server initialized');
    return io;
};

// Emit dashboard update to all connected admins
export const emitDashboardUpdate = async () => {
    if (!io) return;

    try {
        // Import analytics controller function
        const { getDashboardStats } = await import('../Controllers/analytics.js');
        
        // Create mock request/response objects for controller
        const mockReq = {};
        const mockRes = {
            status: () => mockRes,
            json: (data) => {
                if (data.success) {
                    io.to('admin-dashboard').emit('dashboard-update', {
                        type: 'stats',
                        data: data.data,
                        timestamp: new Date()
                    });
                }
            }
        };

        await getDashboardStats(mockReq, mockRes);
    } catch (error) {
        console.error('Error emitting dashboard update:', error);
    }
};

// Emit live metrics update
export const emitLiveMetrics = async () => {
    if (!io) return;

    try {
        const { getLiveMetrics } = await import('../Controllers/analytics.js');
        
        const mockReq = {};
        const mockRes = {
            status: () => mockRes,
            json: (data) => {
                if (data.success) {
                    io.to('admin-dashboard').emit('live-metrics', {
                        type: 'metrics',
                        data: data.data,
                        timestamp: new Date()
                    });
                }
            }
        };

        await getLiveMetrics(mockReq, mockRes);
    } catch (error) {
        console.error('Error emitting live metrics:', error);
    }
};

// Emit booking activity notification
export const emitBookingActivity = (bookingData) => {
    if (!io) return;

    const activity = {
        type: 'booking',
        action: bookingData.action, // 'created', 'updated', 'cancelled'
        booking: {
            id: bookingData.booking._id,
            user: bookingData.booking.user?.username || 'Guest',
            hotel: bookingData.booking.hotel?.name || 'Unknown Hotel',
            amount: bookingData.booking.totalPrice,
            status: bookingData.booking.status,
            paymentStatus: bookingData.booking.paymentStatus
        },
        timestamp: new Date(),
        message: generateActivityMessage(bookingData)
    };

    io.to('admin-dashboard').emit('activity-update', activity);
    
    // Also trigger dashboard stats update
    setTimeout(emitDashboardUpdate, 1000); // Delay to ensure DB is updated
};

// Emit user activity notification
export const emitUserActivity = (userData) => {
    if (!io) return;

    const activity = {
        type: 'user',
        action: userData.action, // 'registered', 'login', 'logout'
        user: {
            id: userData.user._id,
            username: userData.user.username,
            email: userData.user.email,
            isAdmin: userData.user.isAdmin
        },
        timestamp: new Date(),
        message: generateUserActivityMessage(userData)
    };

    io.to('admin-dashboard').emit('activity-update', activity);
    
    // Update live metrics
    setTimeout(emitLiveMetrics, 500);
};

// Emit system notification
export const emitSystemNotification = (notification) => {
    if (!io) return;

    io.to('admin-dashboard').emit('system-notification', {
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message,
        timestamp: new Date(),
        actions: notification.actions || []
    });
};

// Get connected users info
export const getConnectedUsers = () => {
    return Array.from(connectedUsers.values());
};

// Helper function to generate activity messages
function generateActivityMessage(bookingData) {
    const { action, booking } = bookingData;
    const hotel = booking.hotel?.name || 'Unknown Hotel';
    const user = booking.user?.username || 'Guest';
    const amount = `₹${booking.totalPrice?.toLocaleString() || 0}`;

    switch (action) {
        case 'created':
            return `New booking created by ${user} for ${hotel} (${amount})`;
        case 'updated':
            return `Booking updated for ${hotel} - Status: ${booking.status}`;
        case 'cancelled':
            return `Booking cancelled for ${hotel} by ${user}`;
        case 'payment_confirmed':
            return `Payment confirmed for ${hotel} booking (${amount})`;
        default:
            return `Booking activity: ${action}`;
    }
}

// Helper function to generate user activity messages
function generateUserActivityMessage(userData) {
    const { action, user } = userData;
    const username = user.username || 'Unknown User';

    switch (action) {
        case 'registered':
            return `New user registered: ${username}`;
        case 'login':
            return `User logged in: ${username}`;
        case 'logout':
            return `User logged out: ${username}`;
        default:
            return `User activity: ${action}`;
    }
}

export { io };
export default {
    initializeSocket,
    emitDashboardUpdate,
    emitLiveMetrics,
    emitBookingActivity,
    emitUserActivity,
    emitSystemNotification,
    getConnectedUsers
};