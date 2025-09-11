import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, change, changeType = 'increase', loading = false }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              {icon}
            </div>
          </div>
          {change !== undefined && (
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {changeType === 'increase' ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">from last month</span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default StatsCard;