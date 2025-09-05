import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faBed,
  faCreditCard,
  faDownload,
  faEnvelope,
  faPhone,
  faShare,
  faClock,
  faReceipt,
  faSpinner,
  faHome,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import './bookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call to get booking details
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock booking data
        const mockBooking = {
          _id: bookingId,
          bookingReference: `BK${Date.now().toString().slice(-6)}`,
          status: 'confirmed',
          hotel: {
            _id: 'hotel_001',
            name: 'The Grand Palace Hotel',
            city: 'Mumbai',
            address: '123 Marine Drive, Mumbai, Maharashtra 400001',
            images: ['https://via.placeholder.com/400x250'],
            phone: '+91 22 1234 5678',
            email: 'reservations@grandpalace.com'
          },
          checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          checkOutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          guests: { adults: 2, children: 0 },
          rooms: 1,
          totalAmount: 15000,
          paymentMethod: 'credit_card',
          transactionId: `TXN${Date.now()}`,
          createdAt: new Date(),
          guestDetails: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+91 9876543210'
          },
          specialRequests: 'Late check-in requested'
        };
        
        setBooking(mockBooking);
        
        // Simulate email sending
        setTimeout(() => {
          setEmailSent(true);
        }, 2000);
        
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
        // Redirect to home or error page
        setTimeout(() => navigate('/'), 3000);
      }
      setLoading(false);
    };

    if (bookingId) {
      fetchBookingDetails();
    } else {
      navigate('/');
    }
  }, [bookingId, navigate]);

  const calculateNights = () => {
    if (!booking) return 0;
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const handleDownloadReceipt = async () => {
    setDownloadingReceipt(true);
    try {
      // Simulate receipt generation and download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would trigger a file download
      console.log('Downloading receipt for booking:', booking.bookingReference);
      
      // Create a mock receipt download
      const receiptData = generateReceiptData();
      const blob = new Blob([receiptData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${booking.bookingReference}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Failed to download receipt:', error);
    }
    setDownloadingReceipt(false);
  };

  const generateReceiptData = () => {
    if (!booking) return '';
    
    return `
BOOKING CONFIRMATION RECEIPT
============================

Booking Reference: ${booking.bookingReference}
Transaction ID: ${booking.transactionId}
Booking Date: ${format(booking.createdAt, 'MMM dd, yyyy - hh:mm a')}

HOTEL DETAILS
=============
Hotel: ${booking.hotel.name}
Address: ${booking.hotel.address}
Phone: ${booking.hotel.phone}
Email: ${booking.hotel.email}

BOOKING DETAILS
===============
Check-in: ${format(new Date(booking.checkInDate), 'EEEE, MMM dd, yyyy')}
Check-out: ${format(new Date(booking.checkOutDate), 'EEEE, MMM dd, yyyy')}
Duration: ${calculateNights()} nights
Guests: ${booking.guests.adults} adults, ${booking.guests.children} children
Rooms: ${booking.rooms}

GUEST INFORMATION
=================
Name: ${booking.guestDetails.firstName} ${booking.guestDetails.lastName}
Email: ${booking.guestDetails.email}
Phone: ${booking.guestDetails.phone}

PAYMENT DETAILS
===============
Payment Method: ${booking.paymentMethod.replace('_', ' ').toUpperCase()}
Total Amount: ₹${booking.totalAmount.toLocaleString()}
Status: CONFIRMED

IMPORTANT INFORMATION
=====================
- Check-in time: After 2:00 PM
- Check-out time: Before 12:00 PM
- Valid photo ID required at check-in
- Please present this confirmation at the hotel

Thank you for your booking!
Visit us at: bookingapp.com
`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hotel Booking Confirmation',
          text: `My booking at ${booking.hotel.name} is confirmed! Booking reference: ${booking.bookingReference}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const shareText = `My booking at ${booking.hotel.name} is confirmed! Booking reference: ${booking.bookingReference}. Check-in: ${format(new Date(booking.checkInDate), 'MMM dd, yyyy')}`;
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Booking details copied to clipboard!');
    });
  };

  if (loading) {
    return (
      <div className="confirmation-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <h2>Processing your booking confirmation...</h2>
        <p>Please wait while we prepare your booking details.</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="confirmation-error">
        <h2>Booking not found</h2>
        <p>We couldn't find the booking details. You'll be redirected to the home page.</p>
      </div>
    );
  }

  const nights = calculateNights();

  return (
    <div className="booking-confirmation">
      {/* Success Header */}
      <motion.div
        className="confirmation-header"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="success-animation">
          <motion.div
            className="success-circle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
          </motion.div>
          <motion.div
            className="success-checkmark"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          />
        </div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Booking Confirmed!
        </motion.h1>
        
        <motion.p
          className="confirmation-message"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Your reservation has been successfully confirmed. We've sent the confirmation details to your email.
        </motion.p>

        <motion.div
          className="booking-ref"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <span className="ref-label">Booking Reference</span>
          <span className="ref-number">{booking.bookingReference}</span>
        </motion.div>
      </motion.div>

      {/* Email Status */}
      {emailSent ? (
        <motion.div
          className="email-status success"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>Confirmation email sent to {booking.guestDetails.email}</span>
        </motion.div>
      ) : (
        <div className="email-status pending">
          <FontAwesomeIcon icon={faSpinner} spin />
          <span>Sending confirmation email...</span>
        </div>
      )}

      {/* Booking Summary */}
      <motion.div
        className="booking-summary"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="summary-header">
          <h2>Booking Summary</h2>
          <div className="summary-actions">
            <button
              className="btn-secondary"
              onClick={handleShare}
            >
              <FontAwesomeIcon icon={faShare} />
              Share
            </button>
            <button
              className="btn-primary"
              onClick={handleDownloadReceipt}
              disabled={downloadingReceipt}
            >
              <FontAwesomeIcon icon={downloadingReceipt ? faSpinner : faDownload} spin={downloadingReceipt} />
              {downloadingReceipt ? 'Generating...' : 'Download Receipt'}
            </button>
          </div>
        </div>

        <div className="summary-content">
          {/* Hotel Information */}
          <div className="summary-section">
            <div className="hotel-summary">
              <div className="hotel-image">
                <img
                  src={booking.hotel.images?.[0] || 'https://via.placeholder.com/200x120'}
                  alt={booking.hotel.name}
                />
              </div>
              <div className="hotel-info">
                <h3>{booking.hotel.name}</h3>
                <p className="hotel-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  {booking.hotel.address}
                </p>
                <div className="hotel-contact">
                  <span>
                    <FontAwesomeIcon icon={faPhone} />
                    {booking.hotel.phone}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faEnvelope} />
                    {booking.hotel.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="summary-section">
            <h4>Stay Details</h4>
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className="detail-info">
                  <span className="detail-label">Check-in</span>
                  <span className="detail-value">
                    {format(new Date(booking.checkInDate), 'EEEE, MMM dd, yyyy')}
                  </span>
                  <span className="detail-time">After 2:00 PM</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className="detail-info">
                  <span className="detail-label">Check-out</span>
                  <span className="detail-value">
                    {format(new Date(booking.checkOutDate), 'EEEE, MMM dd, yyyy')}
                  </span>
                  <span className="detail-time">Before 12:00 PM</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="detail-info">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{nights} night{nights > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="detail-info">
                  <span className="detail-label">Guests</span>
                  <span className="detail-value">
                    {booking.guests.adults} adults
                    {booking.guests.children > 0 && `, ${booking.guests.children} children`}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <FontAwesomeIcon icon={faBed} />
                </div>
                <div className="detail-info">
                  <span className="detail-label">Rooms</span>
                  <span className="detail-value">{booking.rooms} room{booking.rooms > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <FontAwesomeIcon icon={faCreditCard} />
                </div>
                <div className="detail-info">
                  <span className="detail-label">Total Amount</span>
                  <span className="detail-value price">₹{booking.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="summary-section">
            <h4>Guest Information</h4>
            <div className="guest-info">
              <p><strong>Primary Guest:</strong> {booking.guestDetails.firstName} {booking.guestDetails.lastName}</p>
              <p><strong>Email:</strong> {booking.guestDetails.email}</p>
              <p><strong>Phone:</strong> {booking.guestDetails.phone}</p>
              {booking.specialRequests && (
                <p><strong>Special Requests:</strong> {booking.specialRequests}</p>
              )}
            </div>
          </div>

          {/* Important Information */}
          <div className="summary-section">
            <h4>Important Information</h4>
            <div className="important-info">
              <div className="info-box">
                <h5>Check-in Instructions</h5>
                <ul>
                  <li>Check-in time: After 2:00 PM</li>
                  <li>Valid government-issued photo ID required</li>
                  <li>Present this confirmation at the front desk</li>
                  <li>Credit card may be required for incidentals</li>
                </ul>
              </div>
              <div className="info-box">
                <h5>Cancellation Policy</h5>
                <ul>
                  <li>Free cancellation until 24 hours before check-in</li>
                  <li>50% refund for cancellations within 24 hours</li>
                  <li>No refund for no-shows</li>
                  <li>Modifications subject to availability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="confirmation-actions"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <button
          className="btn-secondary"
          onClick={() => navigate('/')}
        >
          <FontAwesomeIcon icon={faHome} />
          Back to Home
        </button>
        
        <button
          className="btn-secondary"
          onClick={() => navigate('/hotels')}
        >
          <FontAwesomeIcon icon={faSearch} />
          Search More Hotels
        </button>
        
        <button
          className="btn-primary"
          onClick={() => navigate('/my-bookings')}
        >
          <FontAwesomeIcon icon={faReceipt} />
          View My Bookings
        </button>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        className="support-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <p>
          Need help? Contact our support team at{' '}
          <a href="tel:+91-1800-123-4567">+91-1800-123-4567</a> or{' '}
          <a href="mailto:support@bookingapp.com">support@bookingapp.com</a>
        </p>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
