import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faBed,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faReceipt,
  faPhone,
  faEnvelope,
  faSpinner,
  faSearch,
  faFilter,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import BookingDetailsModal from './BookingDetailsModal';
import './bookings.css';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, upcoming, past, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Simulate fetching bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock booking data
        const mockBookings = [
          {
            _id: 'book_001',
            bookingReference: 'BK001234',
            hotel: {
              _id: 'hotel_001',
              name: 'The Grand Palace Hotel',
              city: 'Mumbai',
              images: ['https://via.placeholder.com/300x200']
            },
            checkInDate: new Date('2024-12-15'),
            checkOutDate: new Date('2024-12-18'),
            guests: { adults: 2, children: 0 },
            rooms: 1,
            totalAmount: 15000,
            status: 'confirmed',
            paymentMethod: 'credit_card',
            transactionId: 'TXN123456',
            createdAt: new Date('2024-11-20'),
            guestDetails: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              phone: '+91 9876543210'
            }
          },
          {
            _id: 'book_002',
            bookingReference: 'BK001235',
            hotel: {
              _id: 'hotel_002',
              name: 'Seaside Resort',
              city: 'Goa',
              images: ['https://via.placeholder.com/300x200']
            },
            checkInDate: new Date('2024-11-10'),
            checkOutDate: new Date('2024-11-13'),
            guests: { adults: 4, children: 1 },
            rooms: 2,
            totalAmount: 25000,
            status: 'completed',
            paymentMethod: 'upi',
            transactionId: 'UPI789012',
            createdAt: new Date('2024-10-15'),
            guestDetails: {
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane@example.com',
              phone: '+91 9876543211'
            }
          },
          {
            _id: 'book_003',
            bookingReference: 'BK001236',
            hotel: {
              _id: 'hotel_003',
              name: 'Mountain View Lodge',
              city: 'Manali',
              images: ['https://via.placeholder.com/300x200']
            },
            checkInDate: new Date('2024-12-25'),
            checkOutDate: new Date('2024-12-30'),
            guests: { adults: 2, children: 0 },
            rooms: 1,
            totalAmount: 18000,
            status: 'cancelled',
            paymentMethod: 'paypal',
            transactionId: 'PP345678',
            createdAt: new Date('2024-11-18'),
            guestDetails: {
              firstName: 'Alice',
              lastName: 'Johnson',
              email: 'alice@example.com',
              phone: '+91 9876543212'
            },
            cancellationReason: 'Travel plans changed',
            refundAmount: 16200
          }
        ];
        
        setBookings(mockBookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
      setLoading(false);
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#059669',
      pending: '#d97706',
      completed: '#3b82f6',
      cancelled: '#ef4444',
      refunded: '#6366f1'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: faCheckCircle,
      pending: faClock,
      completed: faCheckCircle,
      cancelled: faTimesCircle,
      refunded: faReceipt
    };
    return icons[status] || faExclamationTriangle;
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by tab
    const now = new Date();
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(booking => 
        new Date(booking.checkInDate) > now && booking.status !== 'cancelled'
      );
    } else if (activeTab === 'past') {
      filtered = filtered.filter(booking => 
        new Date(booking.checkOutDate) < now && booking.status !== 'cancelled'
      );
    } else if (activeTab === 'cancelled') {
      filtered = filtered.filter(booking => booking.status === 'cancelled');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'checkin':
          return new Date(a.checkInDate) - new Date(b.checkInDate);
        case 'amount':
          return b.totalAmount - a.totalAmount;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = async (bookingId) => {
    // Implement cancellation logic
    console.log('Cancel booking:', bookingId);
  };

  const handleDownloadReceipt = (booking) => {
    // Implement receipt download
    console.log('Download receipt for booking:', booking.bookingReference);
  };

  const filteredBookings = filterBookings();

  if (loading) {
    return (
      <div className="bookings-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <div className="bookings-stats">
          <div className="stat-item">
            <span className="stat-number">{bookings.length}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {bookings.filter(b => b.status === 'confirmed').length}
            </span>
            <span className="stat-label">Confirmed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {bookings.filter(b => new Date(b.checkInDate) > new Date()).length}
            </span>
            <span className="stat-label">Upcoming</span>
          </div>
        </div>
      </div>

      <div className="bookings-controls">
        <div className="booking-tabs">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="booking-filters">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="checkin">Check-in Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>
      </div>

      <div className="bookings-list">
        <AnimatePresence>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                className="booking-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="booking-image">
                  <img
                    src={booking.hotel.images?.[0] || 'https://via.placeholder.com/300x200'}
                    alt={booking.hotel.name}
                  />
                  <div className="booking-status">
                    <FontAwesomeIcon 
                      icon={getStatusIcon(booking.status)} 
                      style={{ color: getStatusColor(booking.status) }}
                    />
                    <span style={{ color: getStatusColor(booking.status) }}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="booking-main-info">
                    <h3>{booking.hotel.name}</h3>
                    <p className="booking-location">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      {booking.hotel.city}
                    </p>
                    <p className="booking-reference">
                      Booking ID: {booking.bookingReference}
                    </p>
                  </div>

                  <div className="booking-trip-info">
                    <div className="trip-detail">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      <div>
                        <span className="detail-label">Check-in</span>
                        <span className="detail-value">
                          {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>

                    <div className="trip-detail">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      <div>
                        <span className="detail-label">Check-out</span>
                        <span className="detail-value">
                          {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>

                    <div className="trip-detail">
                      <FontAwesomeIcon icon={faUsers} />
                      <div>
                        <span className="detail-label">Guests</span>
                        <span className="detail-value">
                          {booking.guests.adults + booking.guests.children} guests
                        </span>
                      </div>
                    </div>

                    <div className="trip-detail">
                      <FontAwesomeIcon icon={faBed} />
                      <div>
                        <span className="detail-label">Rooms</span>
                        <span className="detail-value">{booking.rooms} room(s)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  <div className="booking-amount">
                    <span className="amount-label">Total Paid</span>
                    <span className="amount-value">₹{booking.totalAmount.toLocaleString()}</span>
                    {booking.refundAmount && (
                      <span className="refund-info">
                        Refunded: ₹{booking.refundAmount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="action-buttons">
                    <button
                      className="btn-secondary"
                      onClick={() => handleViewDetails(booking)}
                    >
                      View Details
                    </button>

                    <button
                      className="btn-primary"
                      onClick={() => handleDownloadReceipt(booking)}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Receipt
                    </button>

                    {booking.status === 'confirmed' && 
                     new Date(booking.checkInDate) > new Date() && (
                      <button
                        className="btn-danger"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="no-bookings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} size="3x" />
              <h3>No bookings found</h3>
              <p>
                {activeTab === 'all' && 'You haven\'t made any bookings yet.'}
                {activeTab === 'upcoming' && 'No upcoming bookings found.'}
                {activeTab === 'past' && 'No past bookings found.'}
                {activeTab === 'cancelled' && 'No cancelled bookings found.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onCancel={handleCancelBooking}
        onDownloadReceipt={handleDownloadReceipt}
      />
    </div>
  );
};

export default MyBookings;
