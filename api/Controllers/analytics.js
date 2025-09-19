import { Booking } from "../models/Booking.js";
import { Hotel } from "../models/Hotel.js";
import { User } from "../models/User.js";

/**
 * Real-time Analytics Controller
 * Provides live dashboard statistics and metrics
 */

// Get comprehensive dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Parallel queries for better performance
        const [
            totalBookings,
            totalUsers,
            totalHotels,
            todayBookings,
            monthlyBookings,
            totalRevenue,
            todayRevenue,
            monthlyRevenue,
            recentBookings,
            bookingStatusStats,
            monthlyStats
        ] = await Promise.all([
            // Total counts
            Booking.countDocuments(),
            User.countDocuments(),
            Hotel.countDocuments(),

            // Today's metrics
            Booking.countDocuments({ createdAt: { $gte: startOfDay } }),
            Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),

            // Revenue calculations
            Booking.aggregate([
                { $match: { paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]),
            Booking.aggregate([
                { 
                    $match: { 
                        paymentStatus: 'paid',
                        createdAt: { $gte: startOfDay }
                    }
                },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]),
            Booking.aggregate([
                { 
                    $match: { 
                        paymentStatus: 'paid',
                        createdAt: { $gte: startOfMonth }
                    }
                },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]),

            // Recent bookings for activity feed
            Booking.find()
                .populate('user', 'username email')
                .populate('hotel', 'name city')
                .sort({ createdAt: -1 })
                .limit(10),

            // Booking status distribution
            Booking.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        revenue: { 
                            $sum: { 
                                $cond: [
                                    { $eq: ['$paymentStatus', 'paid'] },
                                    '$totalPrice',
                                    0
                                ]
                            }
                        }
                    }
                }
            ]),

            // Monthly performance data (last 12 months)
            Booking.aggregate([
                {
                    $match: {
                        createdAt: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        bookings: { $sum: 1 },
                        revenue: { 
                            $sum: { 
                                $cond: [
                                    { $eq: ['$paymentStatus', 'paid'] },
                                    '$totalPrice',
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $sort: { '_id.year': 1, '_id.month': 1 }
                }
            ])
        ]);

        // Calculate growth percentages
        const yesterdayStart = new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const [yesterdayBookings, lastMonthBookingsCount] = await Promise.all([
            Booking.countDocuments({ 
                createdAt: { 
                    $gte: yesterdayStart, 
                    $lt: startOfDay 
                }
            }),
            Booking.countDocuments({ 
                createdAt: { 
                    $gte: lastMonthStart, 
                    $lte: lastMonthEnd 
                }
            })
        ]);

        // Calculate percentage changes
        const todayGrowth = yesterdayBookings === 0 ? 100 : 
            ((todayBookings - yesterdayBookings) / yesterdayBookings * 100);
        const monthlyGrowth = lastMonthBookingsCount === 0 ? 100 : 
            ((monthlyBookings - lastMonthBookingsCount) / lastMonthBookingsCount * 100);

        // Format response data
        const stats = {
            overview: {
                totalBookings,
                totalUsers,
                totalHotels,
                totalRevenue: totalRevenue[0]?.total || 0,
                todayBookings,
                todayRevenue: todayRevenue[0]?.total || 0,
                monthlyBookings,
                monthlyRevenue: monthlyRevenue[0]?.total || 0,
                todayGrowth: Number(todayGrowth.toFixed(1)),
                monthlyGrowth: Number(monthlyGrowth.toFixed(1))
            },
            recentActivity: recentBookings.map(booking => ({
                id: booking._id,
                type: 'booking',
                user: booking.user?.username || 'Guest',
                hotel: booking.hotel?.name || 'Unknown Hotel',
                location: booking.hotel?.city || 'Unknown',
                amount: booking.totalPrice,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                createdAt: booking.createdAt,
                timeAgo: getTimeAgo(booking.createdAt)
            })),
            statusDistribution: bookingStatusStats.reduce((acc, item) => {
                acc[item._id] = {
                    count: item.count,
                    revenue: item.revenue,
                    percentage: Number(((item.count / totalBookings) * 100).toFixed(1))
                };
                return acc;
            }, {}),
            monthlyPerformance: monthlyStats.map(stat => ({
                month: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}`,
                bookings: stat.bookings,
                revenue: stat.revenue,
                avgBookingValue: stat.bookings > 0 ? stat.revenue / stat.bookings : 0
            }))
        };

        res.status(200).json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString(),
            refreshInterval: 30000 // 30 seconds
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
};

// Get live metrics for real-time updates
export const getLiveMetrics = async (req, res) => {
    try {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        const [recentBookings, recentUsers, pendingBookings] = await Promise.all([
            Booking.countDocuments({ createdAt: { $gte: fiveMinutesAgo } }),
            User.countDocuments({ createdAt: { $gte: fiveMinutesAgo } }),
            Booking.countDocuments({ status: 'pending' })
        ]);

        const metrics = {
            recentBookings,
            recentUsers,
            pendingBookings,
            timestamp: now.toISOString(),
            uptime: process.uptime()
        };

        res.status(200).json({
            success: true,
            data: metrics
        });

    } catch (error) {
        console.error('Live metrics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch live metrics'
        });
    }
};

// Get revenue analytics
export const getRevenueAnalytics = async (req, res) => {
    try {
        const { period = '7d' } = req.query;
        
        let dateFilter;
        const now = new Date();

        switch (period) {
            case '24h':
                dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                dateFilter = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
            default:
                dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        const revenueData = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: dateFilter },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: period === '24h' ? '%Y-%m-%d %H:00' : '%Y-%m-%d',
                            date: '$createdAt'
                        }
                    },
                    revenue: { $sum: '$totalPrice' },
                    bookings: { $sum: 1 }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: revenueData,
            period,
            total: revenueData.reduce((sum, item) => sum + item.revenue, 0)
        });

    } catch (error) {
        console.error('Revenue analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue analytics'
        });
    }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
}

export default {
    getDashboardStats,
    getLiveMetrics,
    getRevenueAnalytics
};