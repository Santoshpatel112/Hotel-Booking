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

export const SimpleHotelDashboard = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [open, setOpen] = useState(true);

  // Load persisted theme on first mount
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('dashboard-theme');
      if (savedTheme === 'dark') {
        setIsDark(true);
      }
    } catch {}
  }, []);

  // Apply theme to document
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

  const navigationItems = [
    { icon: Home, title: "Dashboard", section: "Dashboard" },
    { icon: Building, title: "Hotels", section: "Hotels" },
    { icon: Calendar, title: "Bookings", section: "Bookings", badge: 3 },
    { icon: Users, title: "Users", section: "Users" },
    { icon: DollarSign, title: "Revenue", section: "Revenue" },
    { icon: BarChart3, title: "Analytics", section: "Analytics" },
  ];

  const accountItems = [
    { icon: Settings, title: "Settings", section: "Settings" },
    { icon: HelpCircle, title: "Help & Support", section: "Help" },
  ];

  const renderContent = () => {
    console.log('Rendering content for section:', selectedSection);
    
    const content = {
      Dashboard: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹1,25,000</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12% from last month</p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total Hotels</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5% from last week</p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total Bookings</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">45</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+8% from yesterday</p>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">234</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+3 new this week</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: "New hotel added", desc: "Grand Palace Hotel", time: "2 min ago" },
                  { action: "Booking confirmed", desc: "Room 205 - 3 nights", time: "5 min ago" },
                  { action: "User registered", desc: "john.doe@example.com", time: "10 min ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {activity.action}
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

            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Monthly Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">78%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">4.6/5</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Booking Conversion</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">12.8%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12.8%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      Hotels: (
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hotels Management</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add Hotel
            </button>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✅ Hotels page loaded successfully! Navigation is working.
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Hotel management interface will be displayed here.</p>
        </div>
      ),
      Bookings: (
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bookings Management</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add Booking
            </button>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✅ Bookings page loaded successfully! Navigation is working.
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Booking management interface will be displayed here.</p>
        </div>
      ),
      Users: (
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Users Management</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add User
            </button>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✅ Users page loaded successfully! Navigation is working.
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400">User management interface will be displayed here.</p>
        </div>
      ),
      Revenue: (
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Revenue Analytics</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <BarChart3 className="h-4 w-4" />
              View Details
            </button>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✅ Revenue page loaded successfully! Navigation is working.
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Revenue analytics interface will be displayed here.</p>
        </div>
      ),
      Analytics: (
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <BarChart3 className="h-4 w-4" />
              View Details
            </button>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✅ Analytics page loaded successfully! Navigation is working.
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Analytics dashboard interface will be displayed here.</p>
        </div>
      ),
      Settings: (
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Settings className="h-4 w-4" />
              Save Changes
            </button>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✅ Settings page loaded successfully! Navigation is working.
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Settings interface will be displayed here.</p>
        </div>
      ),
      Help: (
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
      )
    };

    return content[selectedSection] || content.Dashboard;
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
        {/* Sidebar */}
        <nav
          className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm transition-transform duration-300 ease-in-out motion-reduce:transition-none lg:sticky lg:translate-x-0 ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${open ? 'lg:w-64' : 'lg:w-16'}`}
          aria-label="Sidebar"
        >
          {/* Title Section */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                  <Building className="h-5 w-5 text-white" />
                </div>
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
          
          {/* Navigation Items */}
          <div className="space-y-1 mb-8 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
            {navigationItems.map((item) => (
              <button
                key={item.section}
                onClick={() => {
                  console.log('Option clicked:', item.section);
                  setSelectedSection(item.section);
                }}
                title={!open ? item.title : undefined}
                aria-label={item.title}
                className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${
                  selectedSection === item.section
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <div className="grid h-full w-12 place-content-center">
                  <item.icon className="h-4 w-4" />
                </div>
                
                {open && (
                  <span
                    className={`text-sm font-medium transition-opacity duration-200 ${
                      open ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {item.title}
                  </span>
                )}

                {item.badge && open && (
                  <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 text-xs text-white font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Account Section */}
          {open && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Account
              </div>
              {accountItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => {
                    console.log('Option clicked:', item.section);
                    setSelectedSection(item.section);
                  }}
                  title={!open ? item.title : undefined}
                  aria-label={item.title}
                  className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${
                    selectedSection === item.section
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <div className="grid h-full w-12 place-content-center">
                    <item.icon className="h-4 w-4" />
                  </div>
                  
                  {open && (
                    <span
                      className={`text-sm font-medium transition-opacity duration-200 ${
                        open ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {item.title}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Toggle Button */}
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
        </nav>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                onClick={() => setIsMobileSidebarOpen(true)}
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
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
              <button className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900" aria-label="User profile">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="min-h-[400px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHotelDashboard;
