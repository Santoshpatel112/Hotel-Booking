import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Sun, Moon, Search, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ setCollapsed, collapsed }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Sample notifications
  const notifications = [
    { id: 1, message: 'New booking request', time: '5 min ago', read: false },
    { id: 2, message: 'User John Doe updated profile', time: '1 hour ago', read: false },
    { id: 3, message: 'New review submitted', time: '3 hours ago', read: true },
    { id: 4, message: 'System maintenance scheduled', time: 'Yesterday', read: true },
  ];

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      const isDarkMode = JSON.parse(savedMode);
      setDarkMode(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="relative ml-4 hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2" 
              placeholder="Search..."
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            >
              <Bell size={20} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {showNotifications && (
              <motion.div 
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
                            {!notification.read && (
                              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-800 text-center">
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {user?.img ? (
                <img 
                  src={user.img} 
                  alt={user.username || 'User'} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white font-medium">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.isAdmin ? 'Administrator' : 'User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;