import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Lock, Bell, Moon, Sun, Globe, Shield } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    username: 'SantoshPatel',
    email: 'santoshpatelvns5@gmail.com',
    fullName: 'Santosh Patel',
    bio: 'Hotel booking system administrator',
    location: 'Delhi ,India',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    bookingUpdates: true,
    marketingEmails: false,
    systemAlerts: true,
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: false,
    compactMode: false,
    animationsEnabled: true,
  });
  
  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    setAppearanceSettings({ ...appearanceSettings, darkMode: newMode });
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Load dark mode preference from localStorage on mount
  useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      const isDarkMode = JSON.parse(savedMode);
      setDarkMode(isDarkMode);
      setAppearanceSettings({ ...appearanceSettings, darkMode: isDarkMode });
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };
  
  // Handle notification settings changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({ ...notificationSettings, [name]: checked });
  };
  
  // Handle appearance settings changes
  const handleAppearanceChange = (e) => {
    const { name, checked } = e.target;
    setAppearanceSettings({ ...appearanceSettings, [name]: checked });
    
    if (name === 'darkMode') {
      toggleDarkMode();
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Show success message or handle response
    }, 1000);
  };
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Settings sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <User size={18} className="mr-2" />
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg ${activeTab === 'security' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Lock size={18} className="mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg ${activeTab === 'notifications' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Bell size={18} className="mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg ${activeTab === 'appearance' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {darkMode ? <Moon size={18} className="mr-2" /> : <Sun size={18} className="mr-2" />}
              Appearance
            </button>
            <button
              onClick={() => setActiveTab('language')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg ${activeTab === 'language' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Globe size={18} className="mr-2" />
              Language & Region
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg ${activeTab === 'privacy' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Shield size={18} className="mr-2" />
              Privacy
            </button>
          </nav>
        </div>
        
        {/* Settings content */}
        <div className="flex-1 p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={profileForm.location}
                      onChange={handleProfileChange}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
          
          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Settings</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="emailNotifications" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Email Notifications</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="bookingUpdates"
                      name="bookingUpdates"
                      type="checkbox"
                      checked={notificationSettings.bookingUpdates}
                      onChange={handleNotificationChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="bookingUpdates" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Booking Updates</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="marketingEmails"
                      name="marketingEmails"
                      type="checkbox"
                      checked={notificationSettings.marketingEmails}
                      onChange={handleNotificationChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="marketingEmails" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="systemAlerts"
                      name="systemAlerts"
                      type="checkbox"
                      checked={notificationSettings.systemAlerts}
                      onChange={handleNotificationChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="systemAlerts" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">System Alerts</label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
          
          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance Settings</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enable dark mode for the dashboard</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="darkMode"
                        checked={appearanceSettings.darkMode}
                        onChange={handleAppearanceChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">Compact Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reduce spacing between elements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="compactMode"
                        checked={appearanceSettings.compactMode}
                        onChange={handleAppearanceChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">Animations</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enable animations throughout the dashboard</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="animationsEnabled"
                        checked={appearanceSettings.animationsEnabled}
                        onChange={handleAppearanceChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {(activeTab === 'security' || activeTab === 'language' || activeTab === 'privacy') && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;