import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Building,
  Users,
  Calendar as CalendarIcon
} from "lucide-react";

export const RevenueAnalytics = () => {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    lastMonthRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/dashboard/revenue');
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data);
      } else {
        // Mock data for demo
        setRevenueData({
          totalRevenue: 1250000,
          monthlyRevenue: 450000,
          weeklyRevenue: 120000,
          lastMonthRevenue: 380000
        });
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRevenueChange = () => {
    if (revenueData.lastMonthRevenue === 0) return 0;
    return ((revenueData.monthlyRevenue - revenueData.lastMonthRevenue) / revenueData.lastMonthRevenue) * 100;
  };

  const getWeeklyChange = () => {
    const lastWeek = revenueData.monthlyRevenue - revenueData.weeklyRevenue;
    if (lastWeek === 0) return 0;
    return ((revenueData.weeklyRevenue - lastWeek) / lastWeek) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Revenue Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Track and analyze your revenue performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={fetchRevenueData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center gap-1">
              {getRevenueChange() >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${getRevenueChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(getRevenueChange()).toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₹{revenueData.totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All time</p>
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-1">
              {getRevenueChange() >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${getRevenueChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(getRevenueChange()).toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₹{revenueData.monthlyRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This month</p>
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center gap-1">
              {getWeeklyChange() >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${getWeeklyChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(getWeeklyChange()).toFixed(1)}%
              </span>
            </div>
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Weekly Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₹{revenueData.weeklyRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This week</p>
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <PieChart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">18.4%</span>
            </div>
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Growth Rate</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">18.4%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs last month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revenue Trend</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              <Download className="h-4 w-4 inline mr-1" />
              Export
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Revenue chart will be displayed here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Integration with Chart.js or similar library</p>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revenue Breakdown</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              <Download className="h-4 w-4 inline mr-1" />
              Export
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Revenue breakdown chart will be displayed here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Integration with Chart.js or similar library</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Sources */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revenue Sources</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View Details
          </button>
        </div>
        <div className="space-y-4">
          {[
            { source: 'Room Bookings', amount: 850000, percentage: 68, color: 'bg-blue-500' },
            { source: 'Food & Beverage', amount: 250000, percentage: 20, color: 'bg-green-500' },
            { source: 'Spa & Wellness', amount: 100000, percentage: 8, color: 'bg-purple-500' },
            { source: 'Other Services', amount: 50000, percentage: 4, color: 'bg-orange-500' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.source}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-20 text-right">
                  ₹{item.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Hotels */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Performing Hotels</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Grand Palace Hotel', revenue: 320000, bookings: 45, occupancy: 85 },
            { name: 'Luxury Resort', revenue: 280000, bookings: 38, occupancy: 78 },
            { name: 'City Center Hotel', revenue: 240000, bookings: 32, occupancy: 72 },
            { name: 'Beach Resort', revenue: 210000, bookings: 28, occupancy: 68 }
          ].map((hotel, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{hotel.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{hotel.bookings} bookings • {hotel.occupancy}% occupancy</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-100">₹{hotel.revenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
