import React from 'react';
import ModernAdminDashboard from '../../components/ui/ModernAdminDashboard';

/**
 * Demo page for the Modern Admin Dashboard
 * 
 * This page demonstrates the new modern SaaS-style admin dashboard
 * with all the features including:
 * - Collapsible sidebar
 * - Dark/Light mode toggle
 * - Responsive design
 * - Modern stats cards
 * - Interactive charts
 * - Recent activity feed
 * 
 * Usage:
 * Navigate to /admin-demo to see the modern dashboard in action
 */
const AdminDashboardDemo = () => {
  return (
    <div className="min-h-screen">
      <ModernAdminDashboard />
    </div>
  );
};

export default AdminDashboardDemo;