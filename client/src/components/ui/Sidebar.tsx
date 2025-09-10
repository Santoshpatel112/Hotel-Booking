import React from "react";
import { motion } from "framer-motion";
import { Home, Users, BarChart3, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Users", icon: Users, path: "/users" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <motion.nav
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-screen bg-gray-800 text-white"
    >
      <ul>
        {menuItems.map((item) => (
          <li key={item.name} className="p-4 hover:bg-gray-700">
            <Link to={item.path} className="flex items-center gap-2">
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default Sidebar;