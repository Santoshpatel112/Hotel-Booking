import React from "react";
import { motion } from "framer-motion";

const OverviewCard = ({ title, value, growth }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-4 bg-white shadow rounded flex flex-col items-center"
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-2xl">{value}</p>
      <p className={`text-sm ${growth > 0 ? "text-green-500" : "text-red-500"}`}>
        {growth > 0 ? `+${growth}%` : `${growth}%`} from last month
      </p>
    </motion.div>
  );
};

export default OverviewCard;