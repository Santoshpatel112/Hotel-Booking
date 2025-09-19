import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminDashboard.css';
import {
  BarChart3,
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  Bell,
  Search,
  Menu,
  X,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  LogOut,
  Home,
  CreditCard,
  FileText,
  Shield,
  Globe,
  Layers,
  PieChart as PieChartIcon,
  MessageSquare,
  UserCheck,
  UserX,
  CalendarDays,
  Banknote,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Target,
  Award,
  ShoppingBag,
  Receipt,
  Tag,
  Percent
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { hotelAPI } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import toast, { Toaster } from 'react-hot-toast';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Color palette for charts
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Initialize Socket.IO connection for real-time updates
  const {
    isConnected,
    connectionError,
    dashboardData: realtimeDashboardData,
    liveMetrics,
    recentActivity: realtimeActivity,
    refreshDashboard,
    requestLiveData
  } = useSocket({ 
    autoConnect: true, 
    enableNotifications: true, 
    enableDashboard: true 
  });

  // Dashboard State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRevenue: 0,
      totalBookings: 0,
      activeUsers: 0,
      totalHotels: 0,
      todayBookings: 0,
      todayRevenue: 0,
      monthlyBookings: 0,
      monthlyRevenue: 0,
      todayGrowth: 0,
      monthlyGrowth: 0,
      occupancyRate: 0,
      avgBookingValue: 0,
      conversionRate: 0,
      customerSatisfaction: 0
    },
    recentActivity: [],
    chartData: {
      revenue: [],
      bookings: [],
      users: [],
      performance: []
    },
    statusDistribution: {},
    monthlyPerformance: [],
    topHotels: [],
    recentBookings: [],
    userAnalytics: []
  });

  // Navigation items with enhanced structure
  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      count: null,
      description: 'Overview & Analytics'
    },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      icon: Calendar, 
      count: dashboardData.stats.todayBookings || '24',
      description: 'Manage Reservations'
    },
    { 
      id: 'hotels', 
      label: 'Hotels', 
      icon: Building2, 
      count: dashboardData.stats.totalHotels || null,
      description: 'Property Management'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users, 
      count: `${Math.floor((dashboardData.stats.activeUsers || 1200) / 100)}k`,
      description: 'User Management'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: TrendingUp, 
      count: null,
      description: 'Reports & Insights'
    },
    { 
      id: 'revenue', 
      label: 'Revenue', 
      icon: DollarSign, 
      count: null,
      description: 'Financial Overview'
    },
    { 
      id: 'reviews', 
      label: 'Reviews', 
      icon: MessageSquare, 
      count: '42',
      description: 'Customer Feedback'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      count: null,
      description: 'System Configuration'
    }
  ];

  // Fetch dashboard data with enhanced error handling
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // If we have real-time data, use it instead of API call
      if (realtimeDashboardData) {
        console.log('📊 Using real-time dashboard data');
        setDashboardData(prev => ({
          ...prev,
          ...realtimeDashboardData,
          recentActivity: realtimeActivity || prev.recentActivity
        }));
        setLoading(false);
        return;
      }

      // Fallback to regular API call with sample data
      console.log('📊 Fetching dashboard data from API');
      const hotelsResponse = await hotelAPI.getAllHotels();
      const hotels = hotelsResponse.data || [];
      
      // Generate comprehensive sample data for demonstration
      const totalHotels = hotels.length || 25;
      const totalBookings = Math.floor(totalHotels * 18.5);
      const totalRevenue = totalBookings * 3250;
      const activeUsers = Math.floor(totalBookings * 2.8);
      const todayBookings = Math.floor(Math.random() * 25) + 15;
      const todayRevenue = todayBookings * 3200;
      const monthlyBookings = Math.floor(totalBookings * 0.3);
      const monthlyRevenue = monthlyBookings * 3400;
      const occupancyRate = 78.5;
      const avgBookingValue = Math.floor(totalRevenue / totalBookings);
      const conversionRate = 12.8;
      const customerSatisfaction = 4.6;

      // Generate chart data for the last 30 days
      const chartData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dayRevenue = Math.floor(Math.random() * 50000) + 30000;
        const dayBookings = Math.floor(Math.random() * 30) + 15;
        const dayUsers = Math.floor(Math.random() * 150) + 80;
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayRevenue,
          bookings: dayBookings,
          users: dayUsers,
          occupancy: Math.floor(Math.random() * 30) + 65
        };
      });

      // Generate recent activity
      const activities = [
        {
          id: 1,
          type: 'booking',
          user: 'Rajesh Kumar',
          action: 'made a new booking',
          details: 'Luxury Suite at Mumbai Grand',
          time: '2 minutes ago',
          status: 'success',
          amount: '₹15,250'
        },
        {
          id: 2,
          type: 'user',
          user: 'Priya Sharma',
          action: 'created new account',
          details: 'Premium member registration',
          time: '8 minutes ago',
          status: 'info',
          amount: null
        },
        {
          id: 3,
          type: 'payment',
          user: 'Arjun Patel',
          action: 'completed payment',
          details: 'Booking ID: #BK2024-1285',
          time: '15 minutes ago',
          status: 'success',
          amount: '₹22,800'
        },
        {
          id: 4,
          type: 'hotel',
          user: 'Delhi Royale Hotel',
          action: 'updated availability',
          details: '45 rooms now available',
          time: '32 minutes ago',
          status: 'info',
          amount: null
        },
        {
          id: 5,
          type: 'booking',
          user: 'Sneha Reddy',
          action: 'cancelled booking',
          details: 'Family Room - Refund processed',
          time: '1 hour ago',
          status: 'warning',
          amount: '-₹8,450'
        }
      ];

      // Generate top performing hotels
      const topHotels = [
        {
          id: 1,
          name: 'Mumbai Grand Palace',
          location: 'Mumbai, Maharashtra',
          bookings: 184,
          revenue: 598400,
          rating: 4.8,
          occupancy: 92
        },
        {
          id: 2,
          name: 'Delhi Royale Hotel',
          location: 'New Delhi',
          bookings: 156,
          revenue: 487200,
          rating: 4.6,
          occupancy: 88
        },
        {
          id: 3,
          name: 'Bangalore Tech Hub',
          location: 'Bangalore, Karnataka',
          bookings: 134,
          revenue: 421800,
          rating: 4.7,
          occupancy: 85
        },
        {
          id: 4,
          name: 'Goa Beach Resort',
          location: 'Goa',
          bookings: 98,
          revenue: 376400,
          rating: 4.9,
          occupancy: 78
        }
      ];

      // Generate recent bookings
      const recentBookings = [
        {
          id: 'BK2024-1285',
          guest: 'Rajesh Kumar',
          hotel: 'Mumbai Grand Palace',
          checkIn: '2024-01-25',
          checkOut: '2024-01-28',
          amount: 15250,
          status: 'confirmed',
          type: 'Luxury Suite'
        },
        {
          id: 'BK2024-1284',
          guest: 'Arjun Patel',
          hotel: 'Delhi Royale Hotel',
          checkIn: '2024-01-26',
          checkOut: '2024-01-30',
          amount: 22800,
          status: 'confirmed',
          type: 'Presidential Suite'
        },
        {
          id: 'BK2024-1283',
          guest: 'Priya Sharma',
          hotel: 'Bangalore Tech Hub',
          checkIn: '2024-01-24',
          checkOut: '2024-01-27',
          amount: 12600,
          status: 'checked-in',
          type: 'Business Room'
        }
      ];

      setDashboardData({
        stats: {
          totalRevenue,
          totalBookings,
          activeUsers,
          totalHotels,
          todayBookings,
          todayRevenue,
          monthlyBookings,
          monthlyRevenue,
          todayGrowth: 12.5,
          monthlyGrowth: 8.7,
          occupancyRate,
          avgBookingValue,
          conversionRate,
          customerSatisfaction
        },
        recentActivity: activities,
        chartData: {
          revenue: chartData,
          bookings: chartData,
          users: chartData,
          performance: chartData
        },
        statusDistribution: {
          confirmed: 65,
          pending: 20,
          cancelled: 10,
          completed: 5
        },
        monthlyPerformance: chartData.slice(-12),
        topHotels,
        recentBookings,
        userAnalytics: [
          { name: 'New Users', value: 340, color: '#3b82f6' },
          { name: 'Returning Users', value: 680, color: '#10b981' },
          { name: 'Premium Users', value: 190, color: '#f59e0b' }
        ]
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [realtimeDashboardData, realtimeActivity]);

  // Effects
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user, navigate, fetchDashboardData]);

  // Update dashboard data when real-time data changes
  useEffect(() => {
    if (realtimeDashboardData) {
      console.log('📊 Updating dashboard with real-time data');
      setDashboardData(prev => ({
        ...prev,
        ...realtimeDashboardData,
        recentActivity: realtimeActivity || prev.recentActivity
      }));
    }
  }, [realtimeDashboardData, realtimeActivity]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  // Animation variants
  const sidebarVariants = {
    expanded: { width: 320 },
    collapsed: { width: 80 }
  };

  const contentVariants = {
    expanded: { marginLeft: 320 },
    collapsed: { marginLeft: 80 }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className={cn("admin-dashboard min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300")}>
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
          "shadow-xl z-50 flex flex-col backdrop-blur-lg"
        )}
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95))'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))'
        }}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">EasyStay</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                  "hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-105",
                  isActive && "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
                )} />
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                        isActive ? "text-white" : "text-gray-900 dark:text-white"
                      )}>
                        {item.label}
                      </span>
                      <p className={cn(
                        "text-xs transition-colors",
                        isActive ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                      )}>
                        {item.description}
                      </p>
                    </div>
                    {item.count && (
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-lg font-medium",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      )}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User Profile & Actions */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3"
          >
            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.username || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex-1 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                title="Go to Website"
              >
                <Home className="w-4 h-4" />
                <span className="text-xs">Home</span>
              </button>
              <button
                onClick={toggleTheme}
                className="flex-1 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="text-xs">{isDark ? 'Light' : 'Dark'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs">Exit</span>
              </button>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Main Content */}
      <motion.main
        variants={contentVariants}
        animate={sidebarCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen"
      >
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user?.username || 'Admin'} • {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Real-time connection indicator */}
              <motion.div 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                whileHover={{ scale: 1.05 }}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  isConnected ? "bg-green-500" : "bg-red-500"
                )}></div>
                <span className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isConnected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {isConnected ? 'Live' : 'Offline'}
                </span>
                {isConnected ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
              </motion.div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Date Range Selector */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>
              
              {/* Refresh button */}
              <button 
                onClick={() => {
                  if (isConnected) {
                    refreshDashboard();
                  } else {
                    fetchDashboardData();
                  }
                }}
                className={cn(
                  "p-2 rounded-lg transition-colors duration-200",
                  "text-gray-600 dark:text-gray-300",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  loading && "animate-spin"
                )}
                disabled={loading}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardContent
                key="dashboard"
                data={dashboardData}
                loading={loading}
                onRefresh={fetchDashboardData}
                searchQuery={searchQuery}
                dateRange={dateRange}
              />
            )}
            {activeTab === 'bookings' && (
              <BookingsContent
                key="bookings"
                data={dashboardData}
                loading={loading}
                searchQuery={searchQuery}
              />
            )}
            {activeTab === 'hotels' && (
              <HotelsContent
                key="hotels"
                data={dashboardData}
                loading={loading}
                searchQuery={searchQuery}
              />
            )}
            {activeTab === 'users' && (
              <UsersContent
                key="users"
                data={dashboardData}
                loading={loading}
                searchQuery={searchQuery}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsContent
                key="analytics"
                data={dashboardData}
                loading={loading}
                dateRange={dateRange}
              />
            )}
            {activeTab === 'revenue' && (
              <RevenueContent
                key="revenue"
                data={dashboardData}
                loading={loading}
                dateRange={dateRange}
              />
            )}
            {activeTab === 'reviews' && (
              <ReviewsContent
                key="reviews"
                data={dashboardData}
                loading={loading}
                searchQuery={searchQuery}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsContent
                key="settings"
                user={user}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ data, loading, onRefresh, searchQuery, dateRange }) => {
  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${data.stats.totalRevenue.toLocaleString()}`,
      change: `+${data.stats.monthlyGrowth}%`,
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
      description: 'Monthly growth'
    },
    {
      title: 'Total Bookings',
      value: data.stats.totalBookings.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: Calendar,
      color: 'from-blue-400 to-blue-600',
      description: 'Active reservations'
    },
    {
      title: 'Active Users',
      value: `${(data.stats.activeUsers / 1000).toFixed(1)}k`,
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'from-purple-400 to-purple-600',
      description: 'Registered users'
    },
    {
      title: 'Total Hotels',
      value: data.stats.totalHotels.toString(),
      change: '+5.1%',
      changeType: 'positive',
      icon: Building2,
      color: 'from-orange-400 to-orange-600',
      description: 'Listed properties'
    }
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="animate-pulse space-y-4">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      stat.changeType === 'positive' 
                        ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20" 
                        : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20"
                    )}>
                      {stat.changeType === 'positive' ? '↗' : '↘'} {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.description}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                  stat.color
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</p>
            </div>
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData.revenue}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Latest updates</p>
            </div>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {data.recentActivity.slice(0, 5).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                  activity.status === 'success' && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                  activity.status === 'info' && "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                  activity.status === 'warning' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                )}>
                  {activity.type === 'booking' && <Calendar className="w-4 h-4" />}
                  {activity.type === 'user' && <Users className="w-4 h-4" />}
                  {activity.type === 'payment' && <CreditCard className="w-4 h-4" />}
                  {activity.type === 'hotel' && <Building2 className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.details}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    {activity.amount && (
                      <span className={cn(
                        "text-xs font-medium",
                        activity.amount.startsWith('-') 
                          ? "text-red-600 dark:text-red-400" 
                          : "text-green-600 dark:text-green-400"
                      )}>
                        {activity.amount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Placeholder Content Components
const BookingsContent = ({ data, loading, searchQuery }) => (
  <PlaceholderContent
    title="Bookings Management"
    description="Comprehensive booking management system with filters, search, and real-time updates"
    icon={Calendar}
    features={[
      "View all bookings with status tracking",
      "Filter by date, status, and guest",
      "Export booking reports",
      "Real-time booking notifications"
    ]}
  />
);

const HotelsContent = ({ data, loading, searchQuery }) => (
  <PlaceholderContent
    title="Hotel Management"
    description="Manage hotel properties, rooms, and availability"
    icon={Building2}
    features={[
      "Add and edit hotel properties",
      "Manage room types and pricing",
      "Update availability calendars",
      "Monitor hotel performance"
    ]}
  />
);

const UsersContent = ({ data, loading, searchQuery }) => (
  <PlaceholderContent
    title="User Management"
    description="Comprehensive user management and analytics"
    icon={Users}
    features={[
      "View all registered users",
      "Manage user roles and permissions",
      "Track user activity and engagement",
      "Handle user support requests"
    ]}
  />
);

const AnalyticsContent = ({ data, loading, dateRange }) => (
  <PlaceholderContent
    title="Analytics & Reports"
    description="Detailed analytics and business intelligence"
    icon={TrendingUp}
    features={[
      "Revenue and booking analytics",
      "User behavior insights",
      "Performance benchmarking",
      "Custom report generation"
    ]}
  />
);

const RevenueContent = ({ data, loading, dateRange }) => (
  <PlaceholderContent
    title="Revenue Management"
    description="Financial overview and revenue optimization"
    icon={DollarSign}
    features={[
      "Revenue tracking and forecasting",
      "Payment processing overview",
      "Commission and fee management",
      "Financial reporting tools"
    ]}
  />
);

const ReviewsContent = ({ data, loading, searchQuery }) => (
  <PlaceholderContent
    title="Reviews & Feedback"
    description="Manage customer reviews and feedback"
    icon={MessageSquare}
    features={[
      "View and respond to reviews",
      "Sentiment analysis dashboard",
      "Review moderation tools",
      "Customer satisfaction metrics"
    ]}
  />
);

const SettingsContent = ({ user }) => (
  <PlaceholderContent
    title="System Settings"
    description="Configure system settings and preferences"
    icon={Settings}
    features={[
      "User account management",
      "System configuration",
      "Security and permissions",
      "Integration settings"
    ]}
  />
);

// Reusable Placeholder Content Component
const PlaceholderContent = ({ title, description, icon: Icon, features = [] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex items-center justify-center min-h-[500px]"
  >
    <div className="text-center max-w-lg">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{description}</p>
      
      {features.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features:</h4>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-3 justify-center">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
          Coming Soon
        </button>
        <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
          Learn More
        </button>
      </div>
    </div>
  </motion.div>
);

export default AdminDashboard;