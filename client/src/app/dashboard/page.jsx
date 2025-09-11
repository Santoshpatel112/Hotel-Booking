import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, ShoppingCart } from 'lucide-react';

// Import UI components
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import StatsCard from '../../components/ui/StatsCard';
import ActivityFeed from '../../components/ui/ActivityFeed';
import AnalyticsChart from '../../components/ui/AnalyticsChart';
import UserTable from '../../components/ui/UserTable';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulate loading state
  useState(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
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
            
            {/* User Management Table */}
            <div className="mb-6">
              <UserTable 
                loading={loading} 
                onEdit={(user) => console.log('Edit user:', user)} 
                onDelete={(userId) => console.log('Delete user:', userId)} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;