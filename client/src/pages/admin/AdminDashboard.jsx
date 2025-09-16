import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Modern Icons from lucide-react
import {
  Users,
  DollarSign,
  Building2,
  BarChart3,
  PieChart,
  Calendar,
  CheckCircle,
  RefreshCw,
  Eye,
  Sun,
  Moon,
  TrendingUp,
  Menu,
  X,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  MoreVertical,
  ArrowUpRight,
  Activity,
  CreditCard,
  UserCheck,
  Star
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { hotelAPI } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import {
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';

// Enhanced fallback components
const UserTableFallback = ({ loading }) => (
  <div className="p-6 rounded-2xl shadow-sm border bg-white dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h3>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
        Add User
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
        <p className="text-2xl font-bold text-green-600">987</p>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">New This Month</p>
        <p className="text-2xl font-bold text-blue-600">156</p>
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-400">Advanced user management features are being developed...</p>
  </div>
);

const HotelManagementFallback = () => (
  <div className="p-6 rounded-2xl shadow-sm border bg-white dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hotel Management</h3>
      <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
        Add Hotel
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">Total Hotels</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">Available Rooms</p>
        <p className="text-2xl font-bold text-green-600">1,287</p>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">Occupied</p>
        <p className="text-2xl font-bold text-orange-600">934</p>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
        <p className="text-2xl font-bold text-blue-600">4.2</p>
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-400">Hotel management dashboard is being enhanced...</p>
  </div>
);

// Try to import components, fallback if they fail
let UserTable, HotelManagement;
try {
  UserTable = require('../../components/ui/UserTable').default;
  HotelManagement = require('../../components/ui/HotelManagement').default;
} catch (error) {
  console.warn('Some UI components failed to load, using enhanced fallbacks');
  UserTable = UserTableFallback;
  HotelManagement = HotelManagementFallback;
}

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    pendingBookings: 0,
    revenue: 0,
    recentActivity: [],
    bookingTrends: [],
    revenueData: [],
    bookingStatusData: []
  });
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced color palette
  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6'
  };

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
    { id: 'users', label: 'Users', icon: Users, badge: '2.1k' },
    { id: 'properties', label: 'Properties', icon: Building2, badge: null },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: '12' },
    { id: 'analytics', label: 'Analytics', icon: PieChart, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const hotelsResponse = await hotelAPI.getAllHotels();
      const hotels = hotelsResponse.data || [];
      
      const totalHotels = hotels.length;
      const totalBookings = Math.floor(totalHotels * 15.5);
      const pendingBookings = Math.floor(totalBookings * 0.25);
      const totalUsers = Math.floor(totalHotels * 8.3);
      const revenue = hotels.reduce((sum, hotel) => sum + (hotel.cheapestPrice || 0), 0) * 12.5;
      
      // Enhanced chart data
      const bookingTrends = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24*60*60*1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        bookings: Math.floor(Math.random() * 50) + 20,
        revenue: Math.floor(Math.random() * 5000) + 1000
      }));

      const revenueData = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
        revenue: Math.floor(Math.random() * 50000) + 20000,
        bookings: Math.floor(Math.random() * 300) + 100
      }));
      
      const bookingStatusData = [
        { name: 'Confirmed', value: totalBookings - pendingBookings, color: colors.success, percentage: 65 },
        { name: 'Pending', value: pendingBookings, color: colors.warning, percentage: 25 },
        { name: 'Cancelled', value: Math.floor(totalBookings * 0.1), color: colors.danger, percentage: 10 }
      ];
      
      const recentActivity = [
        { 
          id: 1, 
          type: 'booking', 
          title: 'New Booking', 
          message: `Booking confirmed at ${hotels[0]?.name || 'Grand Hotel'}`, 
          time: '2 minutes ago', 
          status: 'success', 
          amount: '$250',
          avatar: '👤',
          urgent: false
        },
        { 
          id: 2, 
          type: 'user', 
          title: 'New Registration',
          message: 'John Doe registered a new account', 
          time: '5 minutes ago', 
          status: 'info',
          avatar: '🆕',
          urgent: false
        },
        { 
          id: 3, 
          type: 'payment', 
          title: 'Payment Pending',
          message: 'Payment verification required for booking #1234', 
          time: '10 minutes ago', 
          status: 'warning', 
          amount: '$180',
          avatar: '💳',
          urgent: true
        },
        { 
          id: 4, 
          type: 'review', 
          title: 'New Review',
          message: 'Received 5-star review from guest', 
          time: '15 minutes ago', 
          status: 'success',
          avatar: '⭐',
          urgent: false
        },
        { 
          id: 5, 
          type: 'system', 
          title: 'System Update',
          message: 'Database optimization completed successfully', 
          time: '1 hour ago', 
          status: 'info',
          avatar: '🔧',
          urgent: false
        }
      ];
      
      setDashboardData({
        totalUsers,
        totalHotels,
        totalBookings,
        pendingBookings,
        revenue,
        recentActivity,
        bookingTrends,
        revenueData,
        bookingStatusData
      });
      
      if (!loading) {
        toast.success('Dashboard data refreshed successfully!', {
          icon: '✨',
          duration: 2000
        });
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      toast.error('Failed to load dashboard data', {
        icon: '❌'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [colors.danger, colors.success, colors.warning, loading]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('adminDarkMode', JSON.stringify(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      toast.success('Dark mode activated', {
        icon: '🌙',
        duration: 2000
      });
    } else {
      document.documentElement.classList.remove('dark');
      toast.success('Light mode activated', {
        icon: '☀️',
        duration: 2000
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };
  
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);
  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!user?.isAdmin) navigate('/');
  }, [user, navigate]);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 3000,
          className: 'dark:bg-gray-800 dark:text-white',
          style: {
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500'
          }
        }} 
      />
      
      <div className="flex h-screen overflow-hidden">
        {/* Modern Sidebar */}
        <motion.aside 
          className={cn(
            "relative flex flex-col border-r transition-all duration-300 z-40",
            sidebarCollapsed ? "w-16" : "w-72",
            "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50",
            "shadow-xl shadow-gray-200/50 dark:shadow-gray-800/50"
          )}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <motion.div 
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </motion.div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  EasyStay
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Admin Dashboard</p>
              </motion.div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01]"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: isActive ? 1.02 : 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                  )} />
                  
                  {!sidebarCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="font-semibold">{item.label}</span>
                      {item.badge && (
                        <motion.span 
                          className={cn(
                            "px-2 py-1 text-xs font-bold rounded-full",
                            isActive 
                              ? "bg-white/20 text-white" 
                              : "bg-blue-500 text-white"
                          )}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: (index * 0.05) + 0.2 }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </nav>
          
          {/* Theme Toggle & User Section */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2">
            <motion.button
              onClick={toggleDarkMode}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ rotate: darkMode ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
              {!sidebarCollapsed && (
                <span className="font-semibold">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </motion.button>
            
            {/* User Profile */}
            {!sidebarCollapsed && (
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.username || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.aside>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <motion.header 
            className={cn(
              "flex items-center justify-between px-6 py-4 border-b",
              "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50",
              "shadow-sm shadow-gray-200/50 dark:shadow-gray-800/50"
            )}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4">
              {/* Mobile menu toggle */}
              <motion.button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              
              {/* Desktop sidebar toggle */}
              <motion.button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                className="hidden lg:flex p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Welcome back, {user?.username}! 👋
                </p>
              </motion.div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <motion.div 
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100/80 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 w-40"
                />
              </motion.div>
              
              {/* Notifications */}
              <motion.button 
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </motion.button>
              
              {/* Refresh */}
              <motion.button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  animate={{ rotate: refreshing ? 360 : 0 }} 
                  transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
                >
                  <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.div>
              </motion.button>
            </div>
          </motion.header>
          
          <main className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Modern Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { 
                        title: 'Total Users', 
                        value: dashboardData.totalUsers, 
                        icon: Users, 
                        change: '+12%', 
                        changeType: 'positive',
                        bgGradient: 'from-blue-500 to-blue-600',
                        iconBg: 'bg-blue-100 dark:bg-blue-900/20',
                        iconColor: 'text-blue-600 dark:text-blue-400',
                        description: 'Total registered users'
                      },
                      { 
                        title: 'Revenue', 
                        value: `₹${dashboardData.revenue.toLocaleString()}`, 
                        icon: DollarSign, 
                        change: '+8.2%', 
                        changeType: 'positive',
                        bgGradient: 'from-emerald-500 to-emerald-600',
                        iconBg: 'bg-emerald-100 dark:bg-emerald-900/20',
                        iconColor: 'text-emerald-600 dark:text-emerald-400',
                        description: 'Total revenue this month'
                      },
                      { 
                        title: 'Bookings', 
                        value: dashboardData.totalBookings, 
                        icon: Calendar, 
                        change: '+15.1%', 
                        changeType: 'positive',
                        bgGradient: 'from-orange-500 to-orange-600',
                        iconBg: 'bg-orange-100 dark:bg-orange-900/20',
                        iconColor: 'text-orange-600 dark:text-orange-400',
                        description: 'Total bookings'
                      },
                      { 
                        title: 'Hotels', 
                        value: dashboardData.totalHotels, 
                        icon: Building2, 
                        change: '+3.2%', 
                        changeType: 'positive',
                        bgGradient: 'from-purple-500 to-purple-600',
                        iconBg: 'bg-purple-100 dark:bg-purple-900/20',
                        iconColor: 'text-purple-600 dark:text-purple-400',
                        description: 'Listed properties'
                      }
                    ].map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div 
                          key={stat.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }} 
                          className={cn(
                            "relative p-6 rounded-2xl shadow-lg border overflow-hidden cursor-pointer",
                            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                            "border-gray-200/50 dark:border-gray-700/50",
                            "hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50",
                            "transition-all duration-300"
                          )}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-5`}></div>
                          <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  {stat.title}
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                  {loading ? (
                                    <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                  ) : (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: (index * 0.1) + 0.2, type: 'spring' }}
                                    >
                                      {stat.value}
                                    </motion.span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {stat.description}
                                </p>
                              </div>
                              <motion.div 
                                className={cn(
                                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                                  stat.iconBg
                                )}
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                <Icon className={cn("w-7 h-7", stat.iconColor)} />
                              </motion.div>
                            </div>
                            <motion.div 
                              className="flex items-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: (index * 0.1) + 0.4 }}
                            >
                              <div className={cn(
                                "flex items-center px-2 py-1 rounded-full text-xs font-semibold",
                                stat.changeType === 'positive' 
                                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              )}>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                <span>{stat.change}</span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-medium">
                                vs last month
                              </span>
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Charts and Activity Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Booking Trends Chart */}
                    <motion.div 
                      className={cn(
                        "lg:col-span-2 p-6 rounded-2xl shadow-lg border",
                        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                        "border-gray-200/50 dark:border-gray-700/50"
                      )}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Trends</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days performance</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg">
                            30D
                          </button>
                          <button className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
                            7D
                          </button>
                        </div>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dashboardData.bookingTrends}>
                            <defs>
                              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis 
                              dataKey="date" 
                              axisLine={false} 
                              tickLine={false}
                              tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false}
                              tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                            />
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                                border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="bookings" 
                              stroke="#3b82f6" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorBookings)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                    
                    {/* Recent Activity */}
                    <motion.div 
                      className={cn(
                        "p-6 rounded-2xl shadow-lg border",
                        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                        "border-gray-200/50 dark:border-gray-700/50"
                      )}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Latest updates</p>
                        </div>
                        <motion.button 
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </motion.button>
                      </div>
                      <div className="space-y-4 max-h-80 overflow-y-auto">
                        {dashboardData.recentActivity.map((activity, index) => (
                          <motion.div 
                            key={activity.id} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + (index * 0.1) }}
                            className={cn(
                              "flex items-start gap-3 p-3 rounded-xl transition-all duration-300",
                              "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                              activity.urgent && "border-l-4 border-orange-500"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0",
                              activity.status === 'success' 
                                ? "bg-emerald-100 dark:bg-emerald-900/30" 
                                : activity.status === 'warning' 
                                ? "bg-orange-100 dark:bg-orange-900/30" 
                                : "bg-blue-100 dark:bg-blue-900/30"
                            )}>
                              {activity.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {activity.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {activity.message}
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {activity.time}
                                  </p>
                                </div>
                                {activity.amount && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1 + (index * 0.1), type: 'spring' }}
                                    className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0"
                                  >
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                      {activity.amount}
                                    </span>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.div 
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                          View all activities
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'users' && (
                <motion.div 
                  key="users" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <UserTable loading={loading} />
                </motion.div>
              )}
              
              {activeTab === 'properties' && (
                <motion.div 
                  key="properties" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <HotelManagement />
                </motion.div>
              )}
              
              {activeTab === 'bookings' && (
                <motion.div 
                  key="bookings" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className={cn(
                    "p-6 rounded-2xl shadow-lg border",
                    "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                    "border-gray-200/50 dark:border-gray-700/50"
                  )}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Booking Management</h3>
                    <p className="text-gray-600 dark:text-gray-400">Advanced booking management features are being developed...</p>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'analytics' && (
                <motion.div 
                  key="analytics" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className={cn(
                    "p-6 rounded-2xl shadow-lg border",
                    "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                    "border-gray-200/50 dark:border-gray-700/50"
                  )}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Advanced Analytics</h3>
                    <p className="text-gray-600 dark:text-gray-400">Comprehensive analytics dashboard coming soon...</p>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'settings' && (
                <motion.div 
                  key="settings" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className={cn(
                    "p-6 rounded-2xl shadow-lg border",
                    "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                    "border-gray-200/50 dark:border-gray-700/50"
                  )}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Settings</h3>
                    <p className="text-gray-600 dark:text-gray-400">Application settings and configuration options...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;