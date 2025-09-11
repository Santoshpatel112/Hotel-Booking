import { motion } from 'framer-motion';
import { Calendar, Clock, User, Hotel, CreditCard, CheckCircle, XCircle } from 'lucide-react';

const ActivityFeed = ({ activities = [], loading = false }) => {
  // Activity type icons mapping
  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Calendar size={16} className="text-blue-500" />;
      case 'user':
        return <User size={16} className="text-purple-500" />;
      case 'hotel':
        return <Hotel size={16} className="text-green-500" />;
      case 'payment':
        return <CreditCard size={16} className="text-yellow-500" />;
      case 'approval':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'cancellation':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  // Default activities if none provided
  const defaultActivities = [
    { id: 1, type: 'booking', message: 'New booking for Luxury Suite', time: '5 minutes ago', user: 'John Doe' },
    { id: 2, type: 'user', message: 'New user registered', time: '1 hour ago', user: 'Sarah Smith' },
    { id: 3, type: 'payment', message: 'Payment received for booking #1234', time: '3 hours ago', user: 'Michael Brown' },
    { id: 4, type: 'hotel', message: 'New hotel added to listings', time: '5 hours ago', user: 'Admin' },
    { id: 5, type: 'approval', message: 'Booking #5678 approved', time: 'Yesterday', user: 'Admin' },
    { id: 6, type: 'cancellation', message: 'Booking #9012 cancelled', time: 'Yesterday', user: 'Emily Johnson' },
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-[400px] overflow-y-auto">
        {loading ? (
          // Loading skeleton
          Array(5).fill(0).map((_, index) => (
            <div key={index} className="p-4 animate-pulse">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          displayActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    <span className="mx-1 text-gray-300 dark:text-gray-600">•</span>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{activity.user}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-center">
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
          View all activity
        </button>
      </div>
    </motion.div>
  );
};

export default ActivityFeed;