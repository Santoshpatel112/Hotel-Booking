import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsChart = ({ type = 'line', data, title, loading = false }) => {
  const [timeRange, setTimeRange] = useState('monthly');
  
  // Default data if none provided
  const defaultMonthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Bookings',
        data: [65, 59, 80, 81, 56, 55, 70, 75, 80, 85, 90, 100],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Revenue',
        data: [28, 48, 40, 45, 46, 50, 55, 60, 70, 80, 90, 110],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const defaultWeeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bookings',
        data: [12, 19, 15, 17, 20, 25, 30],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Revenue',
        data: [10, 15, 12, 14, 18, 22, 28],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const defaultDailyData = {
    labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm'],
    datasets: [
      {
        label: 'Bookings',
        data: [5, 2, 10, 15, 20, 12],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Revenue',
        data: [3, 1, 8, 12, 18, 10],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
            family: '"Inter", sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        titleColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#111827',
        bodyColor: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151',
        borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        bodyFont: {
          family: '"Inter", sans-serif',
        },
        titleFont: {
          family: '"Inter", sans-serif',
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        beginAtZero: true,
      },
    },
  };

  // Get the appropriate data based on the time range
  const getChartData = () => {
    if (data) return data;
    
    switch (timeRange) {
      case 'weekly':
        return defaultWeeklyData;
      case 'daily':
        return defaultDailyData;
      case 'monthly':
      default:
        return defaultMonthlyData;
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex flex-wrap justify-between items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title || 'Analytics Overview'}</h3>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-medium ${timeRange === 'daily' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} rounded-l-lg border border-gray-200 dark:border-gray-700`}
            onClick={() => setTimeRange('daily')}
          >
            Daily
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-medium ${timeRange === 'weekly' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} border-t border-b border-gray-200 dark:border-gray-700`}
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-medium ${timeRange === 'monthly' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} rounded-r-lg border border-gray-200 dark:border-gray-700`}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="p-5">
        {loading ? (
          <div className="animate-pulse flex flex-col">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ) : (
          <div className="h-64">
            {type === 'bar' ? (
              <Bar data={getChartData()} options={options} />
            ) : (
              <Line data={getChartData()} options={options} />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnalyticsChart;