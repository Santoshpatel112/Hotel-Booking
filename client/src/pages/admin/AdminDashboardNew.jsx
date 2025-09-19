import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ModernAdminDashboard from '../../components/ui/ModernAdminDashboard';

/**
 * Enhanced Admin Dashboard Component
 * 
 * This component now uses the modern dashboard design while maintaining
 * backward compatibility. It includes:
 * - Modern SaaS-style interface
 * - Collapsible sidebar
 * - Dark/Light mode toggle
 * - Real-time data integration
 * - Responsive design
 * - Interactive charts and analytics
 */
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Show loading or redirect if not admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need administrator privileges to access this page.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Render the modern dashboard
  return <ModernAdminDashboard />;
};

export default AdminDashboard;