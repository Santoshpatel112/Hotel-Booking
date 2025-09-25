import React, { useState, useEffect, useCallback } from "react";
import {
  Home,
  DollarSign,
  Building2,
  Calendar,
  Users,
  ChevronDown,
  ChevronsRight,
  Moon,
  Sun,
  TrendingUp,
  Activity,
  Bell,
  Settings,
  HelpCircle,
  User,
  MapPin,
  Star,
  CreditCard,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogOut
} from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import CreateHotelModal from '../../components/admin/CreateHotelModal';
import CreateUserModal from '../../components/admin/CreateUserModal';

const API_BASE = 'http://localhost:8000/api';

export const EnhancedAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // State
  const [dashboardStats, setDashboardStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // API calls with auth token
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return response.json();
  };

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall('/dashboard/admin-stats');
      setDashboardStats(data);
      
      // Generate recent activity based on real data
      const activities = [
        {
          icon: Calendar,
          title: "New booking received",
          desc: `${data.stats?.totalBookings || 0} total bookings`,
          time: "2 min ago",
          color: "green"
        },
        {
          icon: Users,
          title: "New user registered",
          desc: `${data.stats?.totalUsers || 0} total users`,
          time: "5 min ago",
          color: "blue"
        },
        {
          icon: Building2,
          title: "Hotel added",
          desc: `${data.stats?.totalHotels || 0} properties listed`,
          time: "10 min ago",
          color: "purple"
        },
        {
          icon: DollarSign,
          title: "Revenue updated",
          desc: `₹${(data.stats?.totalRevenue || 0).toLocaleString()} total revenue`,
          time: "1 hour ago",
          color: "orange"
        },
        {
          icon: Bell,
          title: "System notification",
          desc: "Daily backup completed",
          time: "2 hours ago",
          color: "red"
        },
      ];
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    fetchDashboardStats();
  }, [user, navigate, fetchDashboardStats]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <Toaster position="top-right" />
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Sidebar user={user} onLogout={handleLogout} />
        <MainContent 
          isDark={isDark} 
          setIsDark={toggleTheme} 
          stats={dashboardStats} 
          recentActivity={recentActivity}
          loading={loading}
          user={user}
        />
      </div>
    </div>
  );
};

const Sidebar = ({ user, onLogout }) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
    >
      <TitleSection open={open} user={user} />
      <div className="space-y-1 mb-8">
        <Option
          Icon={Home}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={Building2}
          title="Hotels"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={Calendar}
          title="Bookings"
          selected={selected}
          setSelected={setSelected}
          open={open}
          notifs={3}
        />
        <Option
          Icon={Users}
          title="Users"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={DollarSign}
          title="Revenue"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={BarChart3}
          title="Analytics"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>
      {open && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Account
          </div>
          <Option
            Icon={Settings}
            title="Settings"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={HelpCircle}
            title="Help & Support"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <button
            onClick={onLogout}
            className="flex h-11 w-full items-center rounded-md transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <div className="grid h-full w-12 place-content-center">
              <LogOut className="h-4 w-4" />
            </div>
            {open && (
              <span className="text-sm font-medium">
                Logout
              </span>
            )}
          </button>
        </div>
      )}
      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }) => {
  const isSelected = selected === title;

  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>
      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </span>
      )}
      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 text-xs text-white font-medium">
          {notifs}
        </span>
      )}
    </button>
  );
};

const TitleSection = ({ open, user }) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div
              className={`transition-opacity duration-200 ${
                open ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    EasyStay
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Admin Panel
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && (
          <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      {open && user && (
        <div className="mt-3 flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.username?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.username || 'Admin'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
      <Building2 className="h-5 w-5 text-white" />
    </div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span
            className={`text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Hide
          </span>
        )}
      </div>
    </button>
  );
};

const MainContent = ({ isDark, setIsDark, stats, recentActivity, loading, user }) => {
  const [showCreateHotelModal, setShowCreateHotelModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-6 overflow-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Hotel Management Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.username || 'Admin'} • {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={setIsDark}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <button className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Revenue
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₹{(stats.stats?.totalRevenue || 0).toLocaleString()}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            +12% from last month
          </p>
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Hotels
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.stats?.totalHotels || 0}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            +5% from last week
          </p>
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Bookings
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.stats?.totalBookings || 0}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            +8% from yesterday
          </p>
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Users
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.stats?.totalUsers || 0}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            +3 new this week
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setShowCreateHotelModal(true)}
          className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
              <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Hotel</span>
          </div>
        </button>

        <button
          onClick={() => setShowCreateUserModal(true)}
          className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
              <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add User</span>
          </div>
        </button>

        <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Analytics</span>
          </div>
        </button>

        <button className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-400 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors">
              <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</span>
          </div>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Activity
              </h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.color === 'green'
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : activity.color === 'blue'
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : activity.color === 'purple'
                        ? 'bg-purple-50 dark:bg-purple-900/20'
                        : activity.color === 'orange'
                        ? 'bg-orange-50 dark:bg-orange-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <activity.icon
                      className={`h-4 w-4 ${
                        activity.color === 'green'
                          ? 'text-green-600 dark:text-green-400'
                          : activity.color === 'blue'
                          ? 'text-blue-600 dark:text-blue-400'
                          : activity.color === 'purple'
                          ? 'text-purple-600 dark:text-purple-400'
                          : activity.color === 'orange'
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {activity.desc}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Monthly Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Occupancy Rate
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  78%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: '78%' }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Customer Satisfaction
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  4.6/5
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: '92%' }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Booking Conversion
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  12.8%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: '64%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Top Performing Hotels
            </h3>
            <div className="space-y-3">
              {['Mumbai Grand Palace', 'Delhi Royale Hotel', 'Bangalore Tech Hub', 'Goa Beach Resort'].map(
                (hotel, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {hotel}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {(Math.random() * 50 + 50).toFixed(0)}%
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateHotelModal 
        isOpen={showCreateHotelModal}
        onClose={() => setShowCreateHotelModal(false)}
        onSuccess={() => {
          // Refresh data
          window.location.reload();
        }}
      />
      
      <CreateUserModal 
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onSuccess={() => {
          // Refresh data
          window.location.reload();
        }}
      />
    </div>
  );
};

export default EnhancedAdminDashboard;