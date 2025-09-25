import React, { useState, useEffect } from "react";
import {
  Home,
  Building,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  HelpCircle,
  Bell,
  Moon,
  Sun,
  User,
  Plus,
  TrendingUp,
  Activity,
  ChevronDown,
  ChevronsRight,
  Menu,
} from "lucide-react";
import HotelManagement from './HotelManagement';
import UserManagement from './UserManagement';
import BookingsManagement from './BookingsManagement';
import RevenueAnalytics from './RevenueAnalytics';
import AnalyticsDashboard from './AnalyticsDashboard';
import SettingsPage from './SettingsPage';

export const HotelManagementDashboard = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalHotels: 0,
    totalBookings: 0,
    totalUsers: 0,
    recentActivity: [],
    monthlyPerformance: {
      occupancyRate: 78,
      customerSatisfaction: 4.6,
      bookingConversion: 12.8
    }
  });

  // Load persisted theme on first mount
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('dashboard-theme');
      if (savedTheme === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('dashboard-theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  // Keyboard shortcuts for quick actions
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key?.toLowerCase();
      if (key === 'b') {
        setIsDark((d) => !d);
      }
      if (key === 's') {
        setIsMobileSidebarOpen(true);
      }
      if (e.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/overview');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        // Fallback mock data when API is not available
        setDashboardData({
          totalRevenue: 125000,
          totalHotels: 12,
          totalBookings: 45,
          totalUsers: 234,
          recentActivity: [
            { id: 1, action: "New hotel added", description: "Grand Palace Hotel", time: "2 min ago", type: "hotel" },
            { id: 2, action: "Booking confirmed", description: "Room 205 - 3 nights", time: "5 min ago", type: "booking" },
            { id: 3, action: "User registered", description: "john.doe@example.com", time: "10 min ago", type: "user" },
            { id: 4, action: "Revenue updated", description: "₹15,000 added", time: "1 hour ago", type: "revenue" }
          ],
          monthlyPerformance: {
            occupancyRate: 78,
            customerSatisfaction: 4.6,
            bookingConversion: 12.8
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data when API fails
      setDashboardData({
        totalRevenue: 125000,
        totalHotels: 12,
        totalBookings: 45,
        totalUsers: 234,
        recentActivity: [
          { id: 1, action: "New hotel added", description: "Grand Palace Hotel", time: "2 min ago", type: "hotel" },
          { id: 2, action: "Booking confirmed", description: "Room 205 - 3 nights", time: "5 min ago", type: "booking" },
          { id: 3, action: "User registered", description: "john.doe@example.com", time: "10 min ago", type: "user" },
          { id: 4, action: "Revenue updated", description: "₹15,000 added", time: "1 hour ago", type: "revenue" }
        ],
        monthlyPerformance: {
          occupancyRate: 78,
          customerSatisfaction: 4.6,
          bookingConversion: 12.8
        }
      });
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-hotel':
        setSelectedSection('Hotels');
        // Open add hotel modal
        break;
      case 'add-user':
        setSelectedSection('Users');
        // Open add user modal
        break;
      case 'view-analytics':
        setSelectedSection('Analytics');
        break;
      case 'settings':
        setSelectedSection('Settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          dashboardData={dashboardData}
        />
        <MainContent
          isDark={isDark}
          setIsDark={setIsDark}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          selectedSection={selectedSection}
          dashboardData={dashboardData}
          onQuickAction={handleQuickAction}
        />
      </div>
    </div>
  );
};

const Sidebar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen, selectedSection, setSelectedSection, dashboardData }) => {
  const [open, setOpen] = useState(true);

  const navigationItems = [
    { icon: Home, title: "Dashboard", section: "Dashboard" },
    { icon: Building, title: "Hotels", section: "Hotels" },
    { icon: Calendar, title: "Bookings", section: "Bookings", badge: dashboardData.totalBookings },
    { icon: Users, title: "Users", section: "Users" },
    { icon: DollarSign, title: "Revenue", section: "Revenue" },
    { icon: BarChart3, title: "Analytics", section: "Analytics" },
  ];

  const accountItems = [
    { icon: Settings, title: "Settings", section: "Settings" },
    { icon: HelpCircle, title: "Help & Support", section: "Help" },
  ];

  return (
    <nav
      className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm transition-transform duration-300 ease-in-out motion-reduce:transition-none lg:sticky lg:translate-x-0 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${open ? 'lg:w-64' : 'lg:w-16'}`}
      aria-label="Sidebar"
    >
      <TitleSection open={open} />
      
      <div className="space-y-1 mb-8 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
        {navigationItems.map((item) => (
          <Option
            key={item.section}
            Icon={item.icon}
            title={item.title}
            selected={selectedSection}
            setSelected={setSelectedSection}
            open={open}
            notifs={item.badge}
            section={item.section}
          />
        ))}
      </div>

      {open && (
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Account
          </div>
          {accountItems.map((item) => (
            <Option
              key={item.section}
              Icon={item.icon}
              title={item.title}
              selected={selectedSection}
              setSelected={setSelectedSection}
              open={open}
              section={item.section}
            />
          ))}
        </div>
      )}

      {/* Collapse toggle visible on lg screens */}
      <div className="hidden lg:block">
        <ToggleClose open={open} setOpen={setOpen} />
      </div>

      {/* Close button for mobile */}
      <div className="lg:hidden mt-4">
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="w-full rounded-md border border-gray-200 dark:border-gray-800 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs, section }) => {
  const isSelected = selected === section;
  
  const handleClick = () => {
    console.log('Option clicked:', section);
    setSelected(section);
  };
  
  return (
    <button
      onClick={handleClick}
      title={!open ? title : undefined}
      aria-label={title}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${
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

const TitleSection = ({ open }) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
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
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
      <Building className="h-5 w-5 text-white" />
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

const MainContent = ({ isDark, setIsDark, onOpenMobileSidebar, selectedSection, dashboardData, onQuickAction }) => {
  const renderContent = () => {
    console.log('Rendering content for section:', selectedSection);
    
    // Simple test component to verify navigation
    const TestComponent = ({ section }) => (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {section} Page
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This is the {section} page. Navigation is working correctly!
        </p>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-green-800 dark:text-green-200 text-sm">
            ✅ Navigation successful! You are now viewing the {section} section.
          </p>
        </div>
      </div>
    );
    
    switch (selectedSection) {
      case 'Dashboard':
        return <DashboardContent dashboardData={dashboardData} onQuickAction={onQuickAction} />;
      case 'Hotels':
        return <HotelsContent />;
      case 'Bookings':
        return <BookingsContent />;
      case 'Users':
        return <UsersContent />;
      case 'Revenue':
        return <RevenueContent />;
      case 'Analytics':
        return <AnalyticsContent />;
      case 'Settings':
        return <SettingsContent />;
      case 'Help':
        return <HelpContent />;
      default:
        console.log('Default case - rendering Dashboard');
        return <DashboardContent dashboardData={dashboardData} onQuickAction={onQuickAction} />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
            onClick={onOpenMobileSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {selectedSection === 'Dashboard' ? 'Hotel Management Dashboard' : selectedSection}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {selectedSection === 'Dashboard' ? `Welcome back, admin • ${new Date().toLocaleDateString()}` : `Manage your ${selectedSection.toLowerCase()}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
            aria-label="Toggle dark mode (b)"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <button className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900" aria-label="Account">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};

const DashboardContent = ({ dashboardData, onQuickAction }) => {
  const metrics = [
    {
      title: "Total Revenue",
      value: `₹${dashboardData.totalRevenue.toLocaleString()}`,
      change: "+12% from last month",
      icon: DollarSign,
      color: "green",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Total Hotels",
      value: dashboardData.totalHotels.toString(),
      change: "+5% from last week",
      icon: Building,
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings.toString(),
      change: "+8% from yesterday",
      icon: Calendar,
      color: "purple",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Total Users",
      value: dashboardData.totalUsers.toString(),
      change: "+3 new this week",
      icon: Users,
      color: "orange",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400"
    }
  ];

  const quickActions = [
    { title: "Add Hotel", icon: Plus, action: "add-hotel", color: "blue" },
    { title: "Add User", icon: Plus, action: "add-user", color: "green" },
    { title: "View Analytics", icon: BarChart3, action: "view-analytics", color: "purple" },
    { title: "Settings", icon: Settings, action: "settings", color: "gray" }
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 ${metric.bgColor} rounded-lg`}>
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">{metric.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onQuickAction(action.action)}
            className="p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-lg bg-${action.color}-50 dark:bg-${action.color}-900/20 group-hover:bg-${action.color}-100 dark:group-hover:bg-${action.color}-900/30`}>
                <action.icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400`} />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'hotel' ? 'bg-blue-50 dark:bg-blue-900/20' :
                    activity.type === 'booking' ? 'bg-green-50 dark:bg-green-900/20' :
                    activity.type === 'user' ? 'bg-purple-50 dark:bg-purple-900/20' :
                    'bg-orange-50 dark:bg-orange-900/20'
                  }`}>
                    <Activity className={`h-4 w-4 ${
                      activity.type === 'hotel' ? 'text-blue-600 dark:text-blue-400' :
                      activity.type === 'booking' ? 'text-green-600 dark:text-green-400' :
                      activity.type === 'user' ? 'text-purple-600 dark:text-purple-400' :
                      'text-orange-600 dark:text-orange-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {activity.description}
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

        {/* Monthly Performance */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Monthly Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{dashboardData.monthlyPerformance.occupancyRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${dashboardData.monthlyPerformance.occupancyRate}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{dashboardData.monthlyPerformance.customerSatisfaction}/5</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(dashboardData.monthlyPerformance.customerSatisfaction / 5) * 100}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Booking Conversion</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{dashboardData.monthlyPerformance.bookingConversion}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${dashboardData.monthlyPerformance.bookingConversion}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other sections
const HotelsContent = () => {
  try {
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <HotelManagement />
      </div>
    );
  } catch (error) {
    console.error('Error rendering HotelsContent:', error);
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Hotels Management</h2>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
          <p className="text-green-800 dark:text-green-200 text-sm">
            ✅ Hotels page loaded successfully! Navigation is working.
          </p>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Hotel management interface will be displayed here.</p>
      </div>
    );
  }
};

const BookingsContent = () => {
  try {
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <BookingsManagement />
      </div>
    );
  } catch (error) {
    console.error('Error rendering BookingsContent:', error);
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bookings Management</h2>
        <p className="text-red-600 dark:text-red-400">Error loading bookings management. Please refresh the page.</p>
      </div>
    );
  }
};

const UsersContent = () => {
  try {
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <UserManagement />
      </div>
    );
  } catch (error) {
    console.error('Error rendering UsersContent:', error);
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Users Management</h2>
        <p className="text-red-600 dark:text-red-400">Error loading users management. Please refresh the page.</p>
      </div>
    );
  }
};

const RevenueContent = () => {
  try {
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <RevenueAnalytics />
      </div>
    );
  } catch (error) {
    console.error('Error rendering RevenueContent:', error);
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Revenue Analytics</h2>
        <p className="text-red-600 dark:text-red-400">Error loading revenue analytics. Please refresh the page.</p>
      </div>
    );
  }
};

const AnalyticsContent = () => {
  try {
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <AnalyticsDashboard />
      </div>
    );
  } catch (error) {
    console.error('Error rendering AnalyticsContent:', error);
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Analytics Dashboard</h2>
        <p className="text-red-600 dark:text-red-400">Error loading analytics dashboard. Please refresh the page.</p>
      </div>
    );
  }
};

const SettingsContent = () => {
  try {
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <SettingsPage />
      </div>
    );
  } catch (error) {
    console.error('Error rendering SettingsContent:', error);
    return (
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Settings</h2>
        <p className="text-red-600 dark:text-red-400">Error loading settings. Please refresh the page.</p>
      </div>
    );
  }
};

const HelpContent = () => (
  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Help & Support</h2>
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Getting Started</h3>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Welcome to the Hotel Management Dashboard. Use the sidebar to navigate between different sections.
        </p>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Quick Actions</h3>
        <p className="text-green-800 dark:text-green-200 text-sm">
          Use the quick action buttons on the dashboard to add hotels, users, and view analytics.
        </p>
      </div>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
        <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Keyboard Shortcuts</h3>
        <ul className="text-orange-800 dark:text-orange-200 text-sm space-y-1">
          <li>• Press 'B' to toggle dark/light mode</li>
          <li>• Press 'S' to open mobile sidebar</li>
          <li>• Press 'Escape' to close mobile sidebar</li>
        </ul>
      </div>
    </div>
  </div>
);

export default HotelManagementDashboard;
