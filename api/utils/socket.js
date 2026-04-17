import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

/**
 * Real-time Socket.IO Server Setup
 * Handles WebSocket connections for live dashboard updates
 */

let io;
const connectedUsers = new Map();

/** Returns true when MongoDB is fully connected */
const isDbReady = () => mongoose.connection.readyState === 1;

// ─── Initialize Socket.IO ─────────────────────────────────────────────────────
export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        // Increase ping/pong timeouts to handle slow DB connections
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    // ── Auth middleware ────────────────────────────────────────────────────────
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                // Allow unauthenticated connections (read-only public events)
                socket.userId = null;
                socket.isAdmin = false;
                socket.username = 'Guest';
                return next();
            }

            // Skip DB lookup if MongoDB isn't ready yet
            if (!isDbReady()) {
                socket.userId = null;
                socket.isAdmin = false;
                socket.username = 'Unknown';
                return next();
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('username isAdmin').lean();

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.userId = user._id.toString();
            socket.isAdmin = user.isAdmin;
            socket.username = user.username;

            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return next(new Error('Authentication error: Invalid or expired token'));
            }
            console.error('Socket auth error:', error.message);
            // Don't crash — allow unauthenticated fallback
            socket.userId = null;
            socket.isAdmin = false;
            socket.username = 'Guest';
            next();
        }
    });

    // ── Connection handler ─────────────────────────────────────────────────────
    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.username} (id=${socket.id})`);

        if (socket.userId) {
            connectedUsers.set(socket.userId, {
                socketId: socket.id,
                username: socket.username,
                isAdmin: socket.isAdmin,
                connectedAt: new Date(),
            });
        }

        // Join admin room on connection
        if (socket.isAdmin) {
            socket.join('admin-dashboard');
            console.log(`👑 Admin "${socket.username}" joined dashboard room`);
            emitDashboardUpdate(); // Send initial stats
        }

        socket.on('subscribe-dashboard', () => {
            if (socket.isAdmin) {
                socket.join('admin-dashboard');
                emitDashboardUpdate();
            }
        });

        socket.on('request-live-data', () => {
            if (socket.isAdmin) emitLiveMetrics();
        });

        socket.on('refresh-dashboard', () => {
            if (socket.isAdmin) {
                emitDashboardUpdate();
                socket.emit('dashboard-refreshed', { timestamp: new Date() });
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`🔌 Socket disconnected: ${socket.username} (${reason})`);
            if (socket.userId) connectedUsers.delete(socket.userId);

            if (socket.isAdmin) {
                socket.to('admin-dashboard').emit('admin-disconnected', {
                    username: socket.username,
                    timestamp: new Date(),
                });
            }
        });

        socket.on('error', (error) => {
            console.error(`Socket error [${socket.username}]:`, error.message);
        });
    });

    console.log('✅ Socket.IO server initialized');
    return io;
};

// ─── Dashboard Update Emitter ─────────────────────────────────────────────────
export const emitDashboardUpdate = async () => {
    if (!io || !isDbReady()) return; // Guard: skip if DB not ready

    try {
        const { getDashboardStats } = await import('../Controllers/analytics.js');

        const mockRes = {
            status: () => mockRes,
            json: (data) => {
                if (data.success) {
                    io.to('admin-dashboard').emit('dashboard-update', {
                        type: 'stats',
                        data: data.data,
                        timestamp: new Date(),
                    });
                }
            },
        };

        await getDashboardStats({}, mockRes);
    } catch (error) {
        console.error('emitDashboardUpdate error:', error.message);
    }
};

// ─── Live Metrics Emitter ─────────────────────────────────────────────────────
export const emitLiveMetrics = async () => {
    if (!io || !isDbReady()) return; // Guard: skip if DB not ready

    try {
        const { getLiveMetrics } = await import('../Controllers/analytics.js');

        const mockRes = {
            status: () => mockRes,
            json: (data) => {
                if (data.success) {
                    io.to('admin-dashboard').emit('live-metrics', {
                        type: 'metrics',
                        data: data.data,
                        timestamp: new Date(),
                    });
                }
            },
        };

        await getLiveMetrics({}, mockRes);
    } catch (error) {
        console.error('emitLiveMetrics error:', error.message);
    }
};

// ─── Booking Activity Emitter ─────────────────────────────────────────────────
export const emitBookingActivity = (bookingData) => {
    if (!io) return;

    const activity = {
        type: 'booking',
        action: bookingData.action,
        booking: {
            id: bookingData.booking?._id,
            user: bookingData.booking?.user?.username || 'Guest',
            hotel: bookingData.booking?.hotel?.name || 'Unknown Hotel',
            amount: bookingData.booking?.totalPrice,
            status: bookingData.booking?.status,
            paymentStatus: bookingData.booking?.paymentStatus,
        },
        timestamp: new Date(),
        message: generateActivityMessage(bookingData),
    };

    io.to('admin-dashboard').emit('activity-update', activity);
    // Trigger stats refresh after DB write settles
    setTimeout(emitDashboardUpdate, 1200);
};

// ─── User Activity Emitter ────────────────────────────────────────────────────
export const emitUserActivity = (userData) => {
    if (!io) return;

    const activity = {
        type: 'user',
        action: userData.action,
        user: {
            id: userData.user?._id,
            username: userData.user?.username,
            email: userData.user?.email,
            isAdmin: userData.user?.isAdmin,
        },
        timestamp: new Date(),
        message: generateUserActivityMessage(userData),
    };

    io.to('admin-dashboard').emit('activity-update', activity);
    setTimeout(emitLiveMetrics, 600);
};

// ─── System Notification Emitter ─────────────────────────────────────────────
export const emitSystemNotification = (notification) => {
    if (!io) return;

    io.to('admin-dashboard').emit('system-notification', {
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message,
        timestamp: new Date(),
        actions: notification.actions || [],
    });
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getConnectedUsers = () => Array.from(connectedUsers.values());

function generateActivityMessage({ action, booking }) {
    const hotel = booking?.hotel?.name || 'Unknown Hotel';
    const user = booking?.user?.username || 'Guest';
    const amount = `₹${(booking?.totalPrice || 0).toLocaleString()}`;

    switch (action) {
        case 'created':  return `New booking by ${user} for ${hotel} (${amount})`;
        case 'updated':  return `Booking updated — ${hotel} · Status: ${booking?.status}`;
        case 'cancelled': return `Booking cancelled — ${hotel} by ${user}`;
        case 'payment_confirmed': return `Payment confirmed — ${hotel} (${amount})`;
        default:         return `Booking activity: ${action}`;
    }
}

function generateUserActivityMessage({ action, user }) {
    const username = user?.username || 'Unknown User';
    switch (action) {
        case 'registered': return `New user registered: ${username}`;
        case 'login':      return `User logged in: ${username}`;
        case 'logout':     return `User logged out: ${username}`;
        default:           return `User activity: ${action}`;
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
    getConnectedUsers,
};