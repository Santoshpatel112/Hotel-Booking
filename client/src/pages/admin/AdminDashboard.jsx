import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Activity, ShoppingCart, Building, Bed } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './admin.css';

// Import UI components
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import StatsCard from '../../components/ui/StatsCard';
import ActivityFeed from '../../components/ui/ActivityFeed';
import AnalyticsChart from '../../components/ui/AnalyticsChart';
import UserTable from '../../components/ui/UserTable';
import HotelManagement from '../../components/ui/HotelManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  
  // Simulate loading state
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Check admin access
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header setCollapsed={setCollapsed} collapsed={collapsed} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Navigation Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'dashboard'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Activity size={16} className="inline mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users size={16} className="inline mr-2" />
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'properties'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Building size={16} className="inline mr-2" />
                  Properties
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <>
                {/* Page Title */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome to your booking management dashboard</p>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatsCard 
                    title="Total Users" 
                    value="1,234" 
                    icon={<Users size={20} />} 
                    change="12" 
                    changeType="increase" 
                    loading={loading}
                  />
                  <StatsCard 
                    title="Revenue" 
                    value="$12,345" 
                    icon={<DollarSign size={20} />} 
                    change="8" 
                    changeType="increase" 
                    loading={loading}
                  />
                  <StatsCard 
                    title="Active Sessions" 
                    value="42" 
                    icon={<Activity size={20} />} 
                    change="5" 
                    changeType="decrease" 
                    loading={loading}
                  />
                  <StatsCard 
                    title="Sales" 
                    value="256" 
                    icon={<ShoppingCart size={20} />} 
                    change="18" 
                    changeType="increase" 
                    loading={loading}
                  />
                </div>
                
                {/* Charts and Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2">
                    <AnalyticsChart 
                      title="Booking Analytics" 
                      type="line" 
                      loading={loading}
                    />
                  </div>
                  <div>
                    <ActivityFeed loading={loading} />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'users' && (
              <div className="mb-6">
                <UserTable 
                  loading={loading} 
                  onEdit={(user) => console.log('Edit user:', user)} 
                  onDelete={(userId) => console.log('Delete user:', userId)} 
                />
              </div>
            )}

            {activeTab === 'properties' && (
              <div className="mb-6">
                <HotelManagement />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
