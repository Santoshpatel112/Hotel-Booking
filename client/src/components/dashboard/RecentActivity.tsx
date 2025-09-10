import React from "react";
import { motion } from "framer-motion";

const activities = [
  { message: "New sale recorded", time: "2 min ago" },
  { message: "New user registered", time: "5 min ago" },
  { message: "Product updated", time: "10 min ago" },
];

const RecentActivity = () => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
      <ul>
        {activities.map((activity, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="mb-2"
          >
            <p>{activity.message}</p>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;