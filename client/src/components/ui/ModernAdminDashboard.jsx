import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  WifiOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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
  Cell
} from 'recharts';

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const ModernAdminDashboard = () => {
  const { user, logout } = useAuth();
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
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
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
      monthlyGrowth: 0
    },
    recentActivity: [],
    chartData: {
      revenue: [],
      bookings: []
    },
    statusDistribution: {},
    monthlyPerformance: []
  });

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, count: null },
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: '24' },
    { id: 'hotels', label: 'Hotels', icon: Building2, count: null },
    { id: 'users', label: 'Users', icon: Users, count: '1.2k' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, count: null },
    { id: 'settings', label: 'Settings', icon: Settings, count: null }
  ];

  // Fetch dashboard data
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

      // Fallback to regular API call
      console.log('📊 Fetching dashboard data from API');
      const hotelsResponse = await hotelAPI.getAllHotels();
      const hotels = hotelsResponse.data || [];
      
      // Calculate stats
      const totalHotels = hotels.length;
      const totalBookings = Math.floor(totalHotels * 15.5);
      const activeUsers = Math.floor(totalHotels * 8.3);
      const totalRevenue = totalBookings * 3500;

      // Generate chart data
      const revenueData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 50000) + 20000,
        bookings: Math.floor(Math.random() * 100) + 20
      }));

      // Generate recent activity
      const recentActivity = [
        {
          id: 1,
          type: 'booking',
          user: 'John Doe',
          action: 'Made a new booking',
          time: '2 minutes ago',
          status: 'success'
        },
        {
          id: 2,
          type: 'hotel',
          user: 'Admin',
          action: 'Added new hotel property',
          time: '15 minutes ago',
          status: 'info'
        },
        {
          id: 3,
          type: 'user',
          user: 'Sarah Wilson',
          action: 'Registered new account',
          time: '1 hour ago',
          status: 'success'
        },
        {
          id: 4,
          type: 'booking',
          user: 'Mike Johnson',
          action: 'Cancelled booking',
          time: '2 hours ago',
          status: 'warning'
        }
      ];

      setDashboardData({
        stats: {
          totalRevenue,
          totalBookings,
          activeUsers,
          totalHotels
        },
        recentActivity,
        chartData: {
          revenue: revenueData,
          bookings: revenueData
        }
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [realtimeDashboardData, realtimeActivity]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('adminDarkMode', JSON.stringify(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Animation variants
  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const contentVariants = {
    expanded: { marginLeft: 280 },
    collapsed: { marginLeft: 80 }
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300")}>
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
          "shadow-lg z-40 flex flex-col"
        )}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">EasyStay</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  isActive && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
                )} />
                {!sidebarCollapsed && (
                  <>
                    <span className={cn(
                      "flex-1 text-left text-sm font-medium",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"
                    )}>
                      {item.label}
                    </span>
                    {item.count && (
                      <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User Profile */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.username || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
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
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.username || 'Admin'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Real-time connection indicator */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  isConnected ? "bg-green-500" : "bg-red-500"
                )}></div>
                <span className={cn(
                  "text-xs transition-colors duration-300",
                  isConnected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {isConnected ? 'Live' : 'Offline'}
                </span>
                {isConnected ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Refresh button with real-time capability */}
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
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
              />
            )}
            {activeTab === 'bookings' && (
              <PlaceholderContent
                key="bookings"
                title="Bookings Management"
                description="Manage all hotel bookings and reservations"
              />
            )}
            {activeTab === 'hotels' && (
              <PlaceholderContent
                key="hotels"
                title="Hotel Management"
                description="Add, edit, and manage hotel properties"
              />
            )}
            {activeTab === 'users' && (
              <PlaceholderContent
                key="users"
                title="User Management"
                description="Manage user accounts and permissions"
              />
            )}
            {activeTab === 'analytics' && (
              <PlaceholderContent
                key="analytics"
                title="Analytics & Reports"
                description="View detailed analytics and generate reports"
              />
            )}
            {activeTab === 'settings' && (
              <PlaceholderContent
                key="settings"
                title="System Settings"
                description="Configure system settings and preferences"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ data, loading, onRefresh }) => {
  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${data.stats.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Total Bookings',
      value: data.stats.totalBookings.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: Calendar,
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Active Users',
      value: `${(data.stats.activeUsers / 1000).toFixed(1)}k`,
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Total Hotels',
      value: data.stats.totalHotels.toString(),
      change: '+5.1%',
      changeType: 'positive',
      icon: Building2,
      color: 'from-orange-400 to-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                stat.color
              )}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={cn(
                "text-sm font-medium px-2 py-1 rounded-full",
                stat.changeType === 'positive' 
                  ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
                  : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20"
              )}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
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
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  fill="url(#colorRevenue)" 
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
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
          <div className="space-y-4">
            {data.recentActivity.map((activity, index) => (
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
                  activity.status === 'warning' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
                  activity.status === 'info' && "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                )}>
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Placeholder Content Component
const PlaceholderContent = ({ title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex items-center justify-center min-h-[400px]"
  >
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <Building2 className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">{description}</p>
      <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        Coming Soon
      </button>
    </div>
  </motion.div>
);

export default ModernAdminDashboard;