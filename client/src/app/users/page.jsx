import { useState } from 'react';
import { motion } from 'framer-motion';

// Import UI components
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import UserTable from '../../components/ui/UserTable';

const UsersPage = () => {
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
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">User Management</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage user accounts</p>
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

export default UsersPage;