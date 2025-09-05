import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDashboard,
  faHotel,
  faUsers,
  faCalendarCheck,
  faChartLine,
  faSearch,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faTimes,
  faSpinner,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    monthlyBookings: [],
    recentBookings: []
  });

  // Data states
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'view', 'delete'
  const [selectedItem, setSelectedItem] = useState(null);

  // Check admin access
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch initial data
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'hotels') {
      fetchHotels();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab, currentPage]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Simulate API calls - replace with actual API calls
      const mockStats = {
        totalHotels: 25,
        totalUsers: 150,
        totalBookings: 89,
        totalRevenue: 125000,
        monthlyBookings: [
          { month: 'Jan', bookings: 12, revenue: 18000 },
          { month: 'Feb', bookings: 15, revenue: 22000 },
          { month: 'Mar', bookings: 18, revenue: 28000 },
          { month: 'Apr', bookings: 22, revenue: 35000 },
          { month: 'May', bookings: 25, revenue: 42000 }
        ],
        recentBookings: [
          { id: 1, user: 'John Doe', hotel: 'Grand Hotel', amount: 2500, status: 'confirmed' },
          { id: 2, user: 'Jane Smith', hotel: 'City Lodge', amount: 1800, status: 'pending' },
          { id: 3, user: 'Mike Johnson', hotel: 'Resort Paradise', amount: 3200, status: 'confirmed' }
        ]
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
    setLoading(false);
  };

  const fetchHotels = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const mockHotels = [
        { _id: '1', name: 'Grand Hotel Mumbai', city: 'Mumbai', type: 'hotel', prices: 3500, rating: 4.5, featured: true },
        { _id: '2', name: 'Delhi Palace', city: 'Delhi', type: 'hotel', prices: 2800, rating: 4.2, featured: false },
        { _id: '3', name: 'Goa Beach Resort', city: 'Goa', type: 'resort', prices: 4200, rating: 4.7, featured: true }
      ];
      setHotels(mockHotels);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const mockUsers = [
        { _id: '1', username: 'johndoe', email: 'john@example.com', isAdmin: false, createdAt: '2024-01-15' },
        { _id: '2', username: 'janesmith', email: 'jane@example.com', isAdmin: false, createdAt: '2024-02-20' },
        { _id: '3', username: 'adminuser', email: 'admin@example.com', isAdmin: true, createdAt: '2024-01-01' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
    setLoading(false);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const mockBookings = [
        {
          _id: '1',
          bookingReference: 'BK001',
          user: { username: 'johndoe' },
          hotel: { name: 'Grand Hotel Mumbai' },
          checkInDate: '2024-03-15',
          checkOutDate: '2024-03-18',
          totalPrice: 10500,
          status: 'confirmed',
          paymentStatus: 'paid'
        },
        {
          _id: '2',
          bookingReference: 'BK002',
          user: { username: 'janesmith' },
          hotel: { name: 'Delhi Palace' },
          checkInDate: '2024-03-20',
          checkOutDate: '2024-03-22',
          totalPrice: 5600,
          status: 'pending',
          paymentStatus: 'pending'
        }
      ];
      setBookings(mockBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: faDashboard },
    { id: 'hotels', label: 'Hotels', icon: faHotel },
    { id: 'users', label: 'Users', icon: faUsers },
    { id: 'bookings', label: 'Bookings', icon: faCalendarCheck },
    { id: 'analytics', label: 'Analytics', icon: faChartLine }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="adminDashboard">
      {/* Sidebar */}
      <motion.div 
        className="adminSidebar"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="adminLogo">
          <h2>EasyStay Admin</h2>
        </div>

        <nav className="adminNav">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`adminNavItem ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </nav>

        <div className="adminUser">
          <div className="adminUserInfo">
            <div className="adminUserAvatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="adminUserName">{user?.username}</div>
              <div className="adminUserRole">Administrator</div>
            </div>
          </div>
          <motion.button
            className="adminLogout"
            onClick={handleLogout}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="adminMain">
        {/* Header */}
        <motion.header 
          className="adminHeader"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="adminHeaderLeft">
            <h1>{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p>Manage your booking platform</p>
          </div>

          <div className="adminHeaderRight">
            {activeTab !== 'dashboard' && (
              <div className="adminSearch">
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
        </motion.header>

        {/* Content */}
        <motion.div 
          className="adminContent"
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <DashboardContent stats={stats} loading={loading} />
          )}
          {activeTab === 'hotels' && (
            <HotelsContent 
              hotels={hotels} 
              loading={loading} 
              searchTerm={searchTerm}
              onAdd={() => openModal('add')}
              onEdit={(hotel) => openModal('edit', hotel)}
              onDelete={(hotel) => openModal('delete', hotel)}
            />
          )}
          {activeTab === 'users' && (
            <UsersContent 
              users={users} 
              loading={loading} 
              searchTerm={searchTerm}
            />
          )}
          {activeTab === 'bookings' && (
            <BookingsContent 
              bookings={bookings} 
              loading={loading} 
              searchTerm={searchTerm}
              getStatusColor={getStatusColor}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsContent stats={stats} />
          )}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AdminModal 
            type={modalType}
            item={selectedItem}
            onClose={closeModal}
            onSave={(data) => {
              console.log('Save data:', data);
              closeModal();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ stats, loading }) => (
  <div className="dashboardContent">
    {loading ? (
      <div className="adminLoading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading dashboard...</p>
      </div>
    ) : (
      <>
        {/* Stats Cards */}
        <div className="statsGrid">
          {[
            { title: 'Total Hotels', value: stats.totalHotels, icon: faHotel, color: 'blue' },
            { title: 'Total Users', value: stats.totalUsers, icon: faUsers, color: 'green' },
            { title: 'Total Bookings', value: stats.totalBookings, icon: faCalendarCheck, color: 'orange' },
            { title: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: faChartLine, color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`statCard ${stat.color}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
            >
              <div className="statIcon">
                <FontAwesomeIcon icon={stat.icon} />
              </div>
              <div className="statInfo">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts and Recent Activity */}
        <div className="dashboardGrid">
          <motion.div 
            className="chartCard"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3>Monthly Bookings</h3>
            <div className="chartPlaceholder">
              {/* Chart implementation would go here */}
              <p>Chart visualization</p>
            </div>
          </motion.div>

          <motion.div 
            className="recentActivity"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3>Recent Bookings</h3>
            <div className="activityList">
              {stats.recentBookings?.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  className="activityItem"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="activityInfo">
                    <p className="activityUser">{booking.user}</p>
                    <p className="activityHotel">{booking.hotel}</p>
                  </div>
                  <div className="activityMeta">
                    <p className="activityAmount">₹{booking.amount}</p>
                    <span className={`activityStatus ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </>
    )}
  </div>
);

// Hotels Content Component
const HotelsContent = ({ hotels, loading, searchTerm, onAdd, onEdit, onDelete }) => {
  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tableContent">
      <div className="tableHeader">
        <h2>Hotels Management</h2>
        <motion.button
          className="adminBtn primary"
          onClick={onAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Hotel
        </motion.button>
      </div>

      {loading ? (
        <div className="adminLoading">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      ) : (
        <div className="dataTable">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Type</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels.map((hotel, index) => (
                <motion.tr
                  key={hotel._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td>{hotel.name}</td>
                  <td>{hotel.city}</td>
                  <td>
                    <span className="typeTag">{hotel.type}</span>
                  </td>
                  <td>₹{hotel.prices}</td>
                  <td>
                    <div className="rating">
                      {hotel.rating} ⭐
                    </div>
                  </td>
                  <td>
                    <span className={`featuredTag ${hotel.featured ? 'featured' : ''}`}>
                      {hotel.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div className="actionButtons">
                      <motion.button
                        className="actionBtn view"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </motion.button>
                      <motion.button
                        className="actionBtn edit"
                        onClick={() => onEdit(hotel)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </motion.button>
                      <motion.button
                        className="actionBtn delete"
                        onClick={() => onDelete(hotel)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Users Content Component
const UsersContent = ({ users, loading, searchTerm }) => {
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tableContent">
      <div className="tableHeader">
        <h2>Users Management</h2>
      </div>

      {loading ? (
        <div className="adminLoading">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      ) : (
        <div className="dataTable">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`roleTag ${user.isAdmin ? 'admin' : 'user'}`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actionButtons">
                      <motion.button
                        className="actionBtn view"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </motion.button>
                      <motion.button
                        className="actionBtn edit"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Bookings Content Component
const BookingsContent = ({ bookings, loading, searchTerm, getStatusColor }) => {
  const filteredBookings = bookings.filter(booking =>
    booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tableContent">
      <div className="tableHeader">
        <h2>Bookings Management</h2>
      </div>

      {loading ? (
        <div className="adminLoading">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </div>
      ) : (
        <div className="dataTable">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>User</th>
                <th>Hotel</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <motion.tr
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="bookingRef">{booking.bookingReference}</td>
                  <td>{booking.user.username}</td>
                  <td>{booking.hotel.name}</td>
                  <td>
                    <div className="dateRange">
                      <div>{new Date(booking.checkInDate).toLocaleDateString()}</div>
                      <div>{new Date(booking.checkOutDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="amount">₹{booking.totalPrice}</td>
                  <td>
                    <span className={`statusTag ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <span className={`statusTag ${getStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="actionButtons">
                      <motion.button
                        className="actionBtn view"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </motion.button>
                      <motion.button
                        className="actionBtn edit"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Analytics Content Component
const AnalyticsContent = ({ stats }) => (
  <div className="analyticsContent">
    <h2>Analytics & Reports</h2>
    <div className="analyticsGrid">
      <div className="analyticsCard">
        <h3>Revenue Trends</h3>
        <div className="chartPlaceholder">Revenue Chart</div>
      </div>
      <div className="analyticsCard">
        <h3>Booking Patterns</h3>
        <div className="chartPlaceholder">Booking Chart</div>
      </div>
      <div className="analyticsCard">
        <h3>Hotel Performance</h3>
        <div className="chartPlaceholder">Performance Chart</div>
      </div>
      <div className="analyticsCard">
        <h3>User Activity</h3>
        <div className="chartPlaceholder">Activity Chart</div>
      </div>
    </div>
  </div>
);

// Modal Component
const AdminModal = ({ type, item, onClose, onSave }) => (
  <motion.div
    className="adminModalOverlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="adminModal"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="adminModalHeader">
        <h3>
          {type === 'add' && 'Add New Hotel'}
          {type === 'edit' && 'Edit Hotel'}
          {type === 'delete' && 'Delete Hotel'}
          {type === 'view' && 'Hotel Details'}
        </h3>
        <button className="adminModalClose" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="adminModalContent">
        {type === 'delete' ? (
          <div className="deleteConfirmation">
            <p>Are you sure you want to delete "{item?.name}"?</p>
            <div className="deleteActions">
              <button className="adminBtn secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="adminBtn danger" onClick={() => onSave(item)}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form className="adminForm">
            <div className="formGroup">
              <label>Hotel Name</label>
              <input type="text" defaultValue={item?.name || ''} />
            </div>
            <div className="formGroup">
              <label>City</label>
              <input type="text" defaultValue={item?.city || ''} />
            </div>
            <div className="formGroup">
              <label>Type</label>
              <select defaultValue={item?.type || 'hotel'}>
                <option value="hotel">Hotel</option>
                <option value="resort">Resort</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="cabin">Cabin</option>
              </select>
            </div>
            <div className="formGroup">
              <label>Price</label>
              <input type="number" defaultValue={item?.prices || ''} />
            </div>
            <div className="formActions">
              <button type="button" className="adminBtn secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="adminBtn primary" onClick={(e) => {
                e.preventDefault();
                onSave(item);
              }}>
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  </motion.div>
);

export default AdminDashboard;
