import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faBed,
  faCreditCard,
  faReceipt,
  faDownload,
  faPhone,
  faEnvelope,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faExclamationTriangle,
  faUser,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

const BookingDetailsModal = ({ 
  booking, 
  isOpen, 
  onClose, 
  onCancel, 
  onDownloadReceipt 
}) => {
  if (!isOpen || !booking) return null;

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

  const getPaymentMethodName = (method) => {
    const methods = {
      credit_card: 'Credit/Debit Card',
      paypal: 'PayPal',
      upi: 'UPI Payment',
      debit_card: 'Debit Card'
    };
    return methods[method] || method;
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="booking-details-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="modal-title">
              <h2>Booking Details</h2>
              <div className="booking-status-badge" style={{ backgroundColor: getStatusColor(booking.status) }}>
                <FontAwesomeIcon icon={getStatusIcon(booking.status)} />
                <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
              </div>
            </div>
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Content */}
          <div className="modal-content">
            {/* Hotel Information */}
            <div className="details-section">
              <h3>Hotel Information</h3>
              <div className="hotel-info-card">
                <div className="hotel-image">
                  <img
                    src={booking.hotel.images?.[0] || 'https://via.placeholder.com/200x150'}
                    alt={booking.hotel.name}
                  />
                </div>
                <div className="hotel-details">
                  <h4>{booking.hotel.name}</h4>
                  <p>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    {booking.hotel.city}
                  </p>
                  <div className="booking-reference">
                    <strong>Booking Reference: {booking.bookingReference}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="details-section">
              <h3>Booking Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <div>
                    <span className="info-label">Check-in</span>
                    <span className="info-value">
                      {format(new Date(booking.checkInDate), 'EEEE, MMM dd, yyyy')}
                    </span>
                    <span className="info-time">After 2:00 PM</span>
                  </div>
                </div>

                <div className="info-item">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <div>
                    <span className="info-label">Check-out</span>
                    <span className="info-value">
                      {format(new Date(booking.checkOutDate), 'EEEE, MMM dd, yyyy')}
                    </span>
                    <span className="info-time">Before 12:00 PM</span>
                  </div>
                </div>

                <div className="info-item">
                  <FontAwesomeIcon icon={faUsers} />
                  <div>
                    <span className="info-label">Guests</span>
                    <span className="info-value">
                      {booking.guests.adults} adults
                      {booking.guests.children > 0 && `, ${booking.guests.children} children`}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <FontAwesomeIcon icon={faBed} />
                  <div>
                    <span className="info-label">Rooms</span>
                    <span className="info-value">{booking.rooms} room(s)</span>
                  </div>
                </div>

                <div className="info-item">
                  <FontAwesomeIcon icon={faClock} />
                  <div>
                    <span className="info-label">Duration</span>
                    <span className="info-value">{nights} night{nights > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="info-item">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <div>
                    <span className="info-label">Booked on</span>
                    <span className="info-value">
                      {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="details-section">
              <h3>Guest Information</h3>
              <div className="guest-info-card">
                <div className="guest-details">
                  <div className="guest-item">
                    <FontAwesomeIcon icon={faUser} />
                    <div>
                      <span className="guest-label">Primary Guest</span>
                      <span className="guest-value">
                        {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                      </span>
                    </div>
                  </div>

                  <div className="guest-item">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <div>
                      <span className="guest-label">Email</span>
                      <span className="guest-value">{booking.guestDetails.email}</span>
                    </div>
                  </div>

                  <div className="guest-item">
                    <FontAwesomeIcon icon={faPhone} />
                    <div>
                      <span className="guest-label">Phone</span>
                      <span className="guest-value">{booking.guestDetails.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="details-section">
              <h3>Payment Information</h3>
              <div className="payment-info-card">
                <div className="payment-method">
                  <FontAwesomeIcon icon={faCreditCard} />
                  <div>
                    <span className="payment-label">Payment Method</span>
                    <span className="payment-value">{getPaymentMethodName(booking.paymentMethod)}</span>
                  </div>
                </div>

                <div className="payment-details">
                  <div className="payment-row">
                    <span>Transaction ID</span>
                    <span className="payment-id">{booking.transactionId}</span>
                  </div>
                  
                  <div className="payment-breakdown">
                    <div className="payment-row">
                      <span>Room charges ({nights} nights)</span>
                      <span>₹{Math.round(booking.totalAmount * 0.82).toLocaleString()}</span>
                    </div>
                    <div className="payment-row">
                      <span>Taxes & fees</span>
                      <span>₹{Math.round(booking.totalAmount * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="payment-row total">
                      <span>Total Amount</span>
                      <span>₹{booking.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {booking.refundAmount && (
                    <div className="refund-info">
                      <div className="payment-row refund">
                        <span>Refund Amount</span>
                        <span>₹{booking.refundAmount.toLocaleString()}</span>
                      </div>
                      {booking.cancellationReason && (
                        <div className="cancellation-reason">
                          <strong>Cancellation Reason:</strong> {booking.cancellationReason}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="details-section">
              <h3>Important Information</h3>
              <div className="important-info">
                <div className="info-box">
                  <h4>Check-in Policy</h4>
                  <ul>
                    <li>Check-in: After 2:00 PM</li>
                    <li>Check-out: Before 12:00 PM</li>
                    <li>Valid photo ID required at check-in</li>
                    <li>Present booking confirmation and payment receipt</li>
                  </ul>
                </div>

                <div className="info-box">
                  <h4>Cancellation Policy</h4>
                  <ul>
                    {booking.status === 'confirmed' ? (
                      <>
                        <li>Free cancellation until 24 hours before check-in</li>
                        <li>50% refund for cancellations within 24 hours</li>
                        <li>No refund for no-shows</li>
                      </>
                    ) : (
                      <li>This booking has been {booking.status}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <div className="footer-actions">
              <button
                className="btn-secondary"
                onClick={() => onDownloadReceipt(booking)}
              >
                <FontAwesomeIcon icon={faDownload} />
                Download Receipt
              </button>

              {booking.status === 'confirmed' && 
               new Date(booking.checkInDate) > new Date() && (
                <button
                  className="btn-danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                      onCancel(booking._id);
                      onClose();
                    }
                  }}
                >
                  Cancel Booking
                </button>
              )}

              <button className="btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingDetailsModal;
