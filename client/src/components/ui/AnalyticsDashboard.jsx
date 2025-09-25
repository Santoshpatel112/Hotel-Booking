import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Calendar,
  Eye,
  RefreshCw,
  Download,
  Filter,
  PieChart,
  Activity
} from "lucide-react";

export const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({
    occupancyRate: 0,
    totalHotels: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/dashboard/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        // Mock data for demo
        setAnalyticsData({
          occupancyRate: 78,
          totalHotels: 12,
          totalRooms: 240,
          occupiedRooms: 187,
          availableRooms: 53
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your hotel performance</p>
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
            onClick={fetchAnalyticsData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">+5.2%</span>
            </div>
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total Hotels</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analyticsData.totalHotels}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active properties</p>
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">+3.1%</span>
            </div>
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Occupancy Rate</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analyticsData.occupancyRate}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current occupancy</p>
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">+8.7%</span>
            </div>
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total Rooms</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analyticsData.totalRooms}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available rooms</p>
        </div>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">+12.3%</span>
            </div>
          </div>
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Occupied Rooms</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analyticsData.occupiedRooms}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Currently occupied</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Trend */}
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Occupancy Trend</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              <Download className="h-4 w-4 inline mr-1" />
              Export
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Occupancy trend chart will be displayed here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Integration with Chart.js or similar library</p>
            </div>
          </div>
        </div>

        {/* Room Distribution */}
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Room Distribution</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              <Download className="h-4 w-4 inline mr-1" />
              Export
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Room distribution chart will be displayed here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Integration with Chart.js or similar library</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotel Performance */}
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Hotel Performance</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Grand Palace Hotel', occupancy: 85, revenue: 320000, rating: 4.8 },
              { name: 'Luxury Resort', occupancy: 78, revenue: 280000, rating: 4.6 },
              { name: 'City Center Hotel', occupancy: 72, revenue: 240000, rating: 4.4 },
              { name: 'Beach Resort', occupancy: 68, revenue: 210000, rating: 4.2 }
            ].map((hotel, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{hotel.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{hotel.occupancy}% occupancy • ⭐ {hotel.rating}</p>
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

        {/* Room Status */}
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Room Status</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View Details
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Available</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(analyticsData.availableRooms / analyticsData.totalRooms) * 100}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-12 text-right">
                  {analyticsData.availableRooms}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Occupied</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(analyticsData.occupiedRooms / analyticsData.totalRooms) * 100}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-12 text-right">
                  {analyticsData.occupiedRooms}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Maintenance</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-12 text-right">
                  {Math.floor(analyticsData.totalRooms * 0.05)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Insights</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">4.6</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Rating</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">Based on 1,234 reviews</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">87%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Customer Satisfaction</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">Last 30 days</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">2.3</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Repeat Rate</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">Average stays per customer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
