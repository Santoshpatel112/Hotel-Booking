import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/app/dashboard' },
    { icon: <Users size={20} />, label: 'Users', path: '/app/users' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/app/analytics' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/app/settings' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.div
      className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}
      initial={{ width: collapsed ? 64 : 256 }}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <motion.h1 
            className="text-xl font-bold text-gray-800 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            BookingApp
          </motion.h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive(item.path) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <motion.span
                  className="ml-3 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={logout}
          className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} w-full px-3 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200`}
        >
          <LogOut size={20} />
          {!collapsed && (
            <motion.span
              className="ml-3 font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;