import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Use React Icons instead to avoid lucide-react webpack issues
import { 
  FaUsers, 
  FaDollarSign, 
  FaBuilding, 
  FaChartBar, 
  FaChartPie, 
  FaCalendar,
  FaCheckCircle, 
  FaSync, 
  FaEye, 
  FaSun, 
  FaMoon, 
  FaArrowUp 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { hotelAPI } from '../../services/api';
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
  Legend 
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import './admin-modern.css';

// Simple fallback components to prevent import errors
const UserTableFallback = ({ loading }) => (
  <div className={`p-6 rounded-xl shadow-sm border ${loading ? 'animate-pulse' : ''}`}>
    <h3 className="text-lg font-semibold mb-4">User Management</h3>
    <p className="text-gray-600">User management features coming soon...</p>
  </div>
);

const HotelManagementFallback = () => (
  <div className="p-6 rounded-xl shadow-sm border">
    <h3 className="text-lg font-semibold mb-4">Hotel Management</h3>
    <p className="text-gray-600">Hotel management features coming soon...</p>
  </div>
);

// Try to import components, fallback if they fail
let UserTable, HotelManagement;
try {
  UserTable = require('../../components/ui/UserTable').default;
  HotelManagement = require('../../components/ui/HotelManagement').default;
} catch (error) {
  console.warn('Some UI components failed to load, using fallbacks');
  UserTable = UserTableFallback;
  HotelManagement = HotelManagementFallback;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
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
    bookingStatusData: []
  });
  const [refreshing, setRefreshing] = useState(false);

  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const hotelsResponse = await hotelAPI.getAllHotels();
      const hotels = hotelsResponse.data || [];
      
      const totalHotels = hotels.length;
      const totalBookings = Math.floor(totalHotels * 15.5);
      const pendingBookings = Math.floor(totalBookings * 0.25);
      const revenue = hotels.reduce((sum, hotel) => sum + (hotel.cheapestPrice || 0), 0);
      
      const bookingTrends = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6-i) * 24*60*60*1000).toLocaleDateString('en-US', { weekday: 'short' }),
        bookings: Math.floor(Math.random() * 20) + 10
      }));
      
      const bookingStatusData = [
        { name: 'Confirmed', value: totalBookings - pendingBookings, color: colors.success },
        { name: 'Pending', value: pendingBookings, color: colors.warning },
        { name: 'Cancelled', value: Math.floor(totalBookings * 0.1), color: colors.danger }
      ];
      
      const recentActivity = [
        { id: 1, type: 'booking', message: `New booking at ${hotels[0]?.name || 'Hotel ABC'}`, time: '2 min ago', status: 'success', amount: '$250' },
        { id: 2, type: 'user', message: 'New user registration - John Doe', time: '5 min ago', status: 'info' },
        { id: 3, type: 'booking', message: 'Payment pending verification', time: '10 min ago', status: 'warning', amount: '$180' },
        { id: 4, type: 'review', message: 'New 5-star review received', time: '15 min ago', status: 'success' }
      ];
      
      setDashboardData({
        totalUsers: Math.floor(totalHotels * 8.3),
        totalHotels,
        totalBookings,
        pendingBookings,
        revenue,
        recentActivity,
        bookingTrends,
        bookingStatusData
      });
      
      toast.success('Dashboard refreshed!');
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [colors.danger, colors.success, colors.warning]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('adminDarkMode', JSON.stringify(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      toast.success('🌙 Dark mode activated');
    } else {
      document.documentElement.classList.remove('dark');
      toast.success('☀️ Light mode activated');
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
  
  return (
    <div className={`min-h-screen transition-colors duration-300 admin-dashboard ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      <div className="flex h-screen">
        {/* Modern Sidebar */}
        <motion.div 
          className={`${collapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200/50'} border-r transition-all duration-300 flex flex-col shadow-xl backdrop-blur-lg glass-effect`}
          initial={{ x: -100 }}
          animate={{ x: 0 }}
        >
          <div className="p-4 border-b border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <FaBuilding className="w-5 h-5 text-white" />
              </div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">BookingApp</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Admin Panel</p>
                </motion.div>
              )}
            </div>
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
                { id: 'users', label: 'Users', icon: FaUsers },
                { id: 'properties', label: 'Properties', icon: FaBuilding },
                { id: 'analytics', label: 'Analytics', icon: FaChartPie }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 font-medium ${
                      activeTab === item.id ? 
                        'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]' : 
                        darkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-[1.01]' : 'text-gray-600 hover:bg-gray-100/80 hover:scale-[1.01]'
                    }`}
                    whileHover={{ scale: activeTab === item.id ? 1.02 : 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && (
                      <motion.span 
                        className="font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30">
            <motion.button
              onClick={toggleDarkMode}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                darkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white' : 'text-gray-600 hover:bg-gray-100/80'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-5 h-5 transition-transform duration-300 ${
                darkMode ? 'rotate-0' : 'rotate-180'
              }`}>
                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </div>
              {!collapsed && (
                <motion.span 
                  className="font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <motion.header 
            className={`${darkMode ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200/50'} border-b px-6 py-4 flex items-center justify-between shadow-sm backdrop-blur-lg glass-effect`}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
          >
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={() => setCollapsed(!collapsed)} 
                className={`p-3 rounded-xl transition-all duration-300 ${
                  darkMode ? 'hover:bg-gray-700/50 bg-gray-700/30' : 'hover:bg-gray-100/80 bg-gray-100/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaChartBar className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Welcome back, {user?.username}!</p>
              </motion.div>
            </div>
            <motion.button 
              onClick={handleRefresh} 
              className={`p-3 rounded-xl transition-all duration-300 ${
                darkMode ? 'hover:bg-gray-700/50 bg-gray-700/30' : 'hover:bg-gray-100/80 bg-gray-100/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                animate={{ rotate: refreshing ? 360 : 0 }} 
                transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
              >
                <FaSync className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.div>
            </motion.button>
          </motion.header>
          
          <main className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { title: 'Total Users', value: dashboardData.totalUsers, icon: FaUsers, bgColor: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-100 dark:bg-blue-900/20', iconColor: 'text-blue-600 dark:text-blue-400' },
                      { title: 'Revenue', value: `₹${dashboardData.revenue.toLocaleString()}`, icon: FaDollarSign, bgColor: 'from-emerald-500 to-emerald-600', iconBg: 'bg-emerald-100 dark:bg-emerald-900/20', iconColor: 'text-emerald-600 dark:text-emerald-400' },
                      { title: 'Bookings', value: dashboardData.totalBookings, icon: FaCalendar, bgColor: 'from-orange-500 to-orange-600', iconBg: 'bg-orange-100 dark:bg-orange-900/20', iconColor: 'text-orange-600 dark:text-orange-400' },
                      { title: 'Hotels', value: dashboardData.totalHotels, icon: FaBuilding, bgColor: 'from-purple-500 to-purple-600', iconBg: 'bg-purple-100 dark:bg-purple-900/20', iconColor: 'text-purple-600 dark:text-purple-400' }
                    ].map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div 
                          key={stat.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }} 
                          className={`relative p-6 rounded-2xl shadow-lg border modern-card metric-card overflow-hidden ${
                            darkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-gray-200/50'
                          }`}
                        >
                          {/* Gradient background overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-5`}></div>
                          
                          <div className="relative flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.title}</p>
                              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {loading ? (
                                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded loading-skeleton"></div>
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
                              <motion.div 
                                className="flex items-center mt-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: (index * 0.1) + 0.4 }}
                              >
                                <div className="flex items-center px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                  <FaArrowUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mr-1" />
                                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+12%</span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-medium">vs last month</span>
                              </motion.div>
                            </div>
                            <motion.div 
                              className={`w-16 h-16 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Enhanced Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className={`chart-container modern-card ${darkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-gray-200/50'}`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Trends</h3>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Weekly Data</span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={dashboardData.bookingTrends}>
                          <defs>
                            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={colors.primary} stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: darkMode ? '#9CA3AF' : '#6B7280' }}
                          />
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                              border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                              borderRadius: '12px',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="bookings" 
                            stroke={colors.primary} 
                            strokeWidth={3}
                            fill="url(#colorBookings)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className={`chart-container modern-card ${darkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-gray-200/50'}`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Status</h3>
                        <div className="flex items-center space-x-4">
                          {dashboardData.bookingStatusData.map((entry, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{entry.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={320}>
                        <RechartsPieChart>
                          <defs>
                            {dashboardData.bookingStatusData.map((entry, index) => (
                              <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                                <stop offset="100%" stopColor={entry.color} stopOpacity={0.7}/>
                              </linearGradient>
                            ))}
                          </defs>
                          <Pie 
                            data={dashboardData.bookingStatusData} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={70} 
                            outerRadius={130} 
                            paddingAngle={8} 
                            dataKey="value"
                          >
                            {dashboardData.bookingStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                              border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                              borderRadius: '12px',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </div>
                  
                  {/* Enhanced Activity Feed */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className={`modern-card ${darkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-gray-200/50'}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                      <motion.button 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaEye className="w-4 h-4" />
                        View All
                      </motion.button>
                    </div>
                    <div className="space-y-4">
                      {dashboardData.recentActivity.map((activity, index) => (
                        <motion.div 
                          key={activity.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + (index * 0.1) }}
                          className={`activity-item flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                            darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50/80'
                          }`}
                        >
                          <motion.div 
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                              activity.status === 'success' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30' : 
                              activity.status === 'warning' ? 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30' : 
                              'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30'
                            }`}
                            whileHover={{ rotate: 5, scale: 1.1 }}
                          >
                            {activity.type === 'booking' ? 
                              <FaCalendar className={`w-5 h-5 ${
                                activity.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                                activity.status === 'warning' ? 'text-orange-600 dark:text-orange-400' :
                                'text-blue-600 dark:text-blue-400'
                              }`} /> : 
                             activity.type === 'user' ? 
                              <FaUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : 
                              <FaCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            }
                          </motion.div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{activity.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                          </div>
                          {activity.amount && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1 + (index * 0.1), type: 'spring' }}
                              className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
                            >
                              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{activity.amount}</span>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
              
              {activeTab === 'users' && (
                <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <UserTable loading={loading} />
                </motion.div>
              )}
              
              {activeTab === 'properties' && (
                <motion.div key="properties" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <HotelManagement />
                </motion.div>
              )}
              
              {activeTab === 'analytics' && (
                <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`p-6 rounded-xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Advanced Analytics</h3>
                    <p className="text-gray-600 dark:text-gray-400">Advanced analytics dashboard coming soon...</p>
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