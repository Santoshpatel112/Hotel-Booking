import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCheckCircle,
  faExclamationTriangle,
  faShieldHalved,
  faSpinner,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './booking.css';

// Razorpay script loader utility
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BookingModal = ({ hotel, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Dates & Guests, 2: Guest Details, 3: Payment, 4: Confirmation
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Booking data
  const [bookingData, setBookingData] = useState({
    dates: [{
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000), // Tomorrow
      key: 'selection'
    }],
    guests: { adults: 1, children: 0 },
    rooms: 1,
    guestDetails: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      specialRequests: ''
    }
  });

  const [priceBreakdown, setPriceBreakdown] = useState({
    basePrice: 0, taxes: 0, fees: 0, total: 0, nights: 1
  });

  // Calculate pricing
  useEffect(() => {
    if (hotel && bookingData.dates[0]) {
      const checkIn = bookingData.dates[0].startDate;
      const checkOut = bookingData.dates[0].endDate;
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      
      const basePrice = hotel.prices * bookingData.rooms * nights;
      const taxes = basePrice * 0.18; // 18% GST
      const fees = basePrice * 0.05; // 5% service fee
      const total = basePrice + taxes + fees;

      setPriceBreakdown({ basePrice, taxes, fees, total, nights });
    }
  }, [hotel, bookingData.dates, bookingData.rooms]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setBookingData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!bookingData.dates[0].startDate || !bookingData.dates[0].endDate) {
        newErrors.dates = 'Please select check-in and check-out dates';
      }
    }

    if (stepNumber === 2) {
      if (!bookingData.guestDetails.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!bookingData.guestDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!bookingData.guestDetails.email.trim() || !/\S+@\S+\.\S+/.test(bookingData.guestDetails.email)) {
        newErrors.email = 'Valid email is required';
      }
      if (!bookingData.guestDetails.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setErrors({});
  };

  // --------------------------------------------------------------------------
  // ROBUST RAZORPAY INTEGRATION LOGIC
  // --------------------------------------------------------------------------
  const handleBooking = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    setErrors({});

    try {
      // 1. Load Razorpay Script dynamically
      const res = await loadRazorpayScript();
      if (!res) {
        setErrors({ payment: 'Failed to load Razorpay SDK. Are you online?' });
        setLoading(false);
        return;
      }

      // 2. Fetch Order ID securely from our backend
      const orderResponse = await api.post('/payment/order', {
        amount: priceBreakdown.total,
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      });

      if (!orderResponse.data || !orderResponse.data.id) {
        throw new Error("Unable to create order with Razorpay.");
      }

      // 3. Handle Mock Mode fallback (if developer API keys are invalid)
      if (orderResponse.data.isMock) {
        toast?.success("Mock Payment Mode Active. Simulating checkout...");
        
        // Simulating the secure crypto handshake
        const verifyMock = await api.post('/payment/verify', {
           razorpay_order_id: orderResponse.data.id,
           razorpay_payment_id: "pay_mock_" + Date.now(),
           razorpay_signature: "mock_signature_bypass"
        });

        if (verifyMock.data.verified) {
           setStep(4);
           setTimeout(() => {
             onSuccess && onSuccess(bookingData);
             onClose();
           }, 3000);
        }
        return;
      }

      // 4. Configure Razorpay Options (Standard Production Flow)
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: "INR",
        name: "EasyStay",
        description: `Booking for ${hotel.name}`,
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            // 4a. Crypto-verify Payment Signature with our Backend
            const verification = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verification.data.verified) {
              setStep(4);
              setTimeout(() => {
                onSuccess && onSuccess(bookingData);
                onClose();
              }, 3000);
            } else {
              setErrors({ payment: 'Payment verification failed. Invalid Signature.' });
              setStep(3);
            }
          } catch (verifyError) {
            console.error(verifyError);
            setErrors({ payment: 'Verification process failed.' });
            setStep(3);
          }
        },
        prefill: {
          name: `${bookingData.guestDetails.firstName} ${bookingData.guestDetails.lastName}`,
          email: bookingData.guestDetails.email,
          contact: bookingData.guestDetails.phone
        },
        theme: {
          color: "#2563eb"
        }
      };

      // 5. Open Modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        console.error("Razorpay inner failure", response.error);
        setErrors({ payment: response.error.description });
        setLoading(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error('Booking error:', error);
      const apiErrorMsg = error.response?.data?.details || error.response?.data?.error || error.message;
      setErrors({ payment: `Payment Initialization Failed: ${apiErrorMsg}` });
    } finally {
      // Regardless of payment modal open success, turn off loading button to allow trying again
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="bookingModalOverlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bookingModal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bookingHeader">
            <div className="bookingHotelInfo">
              <h2>{hotel?.name}</h2>
              <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {hotel?.city}</p>
            </div>
            <button className="bookingCloseBtn" onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="bookingProgress">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className={`progressStep ${step >= num ? 'active' : ''}`}>
                <div className="progressCircle">
                  {step > num ? <FontAwesomeIcon icon={faCheckCircle} /> : num}
                </div>
                <span>
                  {num === 1 && 'Dates'}
                  {num === 2 && 'Details'}
                  {num === 3 && 'Payment'}
                  {num === 4 && 'Confirmed'}
                </span>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="bookingContent">
            {/* Step 1: Dates & Guests */}
            {step === 1 && (
              <motion.div className="bookingStep" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <h3>Select Dates & Guests</h3>
                <div className="dateSelection">
                  <label>Check-in & Check-out Dates</label>
                  <DateRange
                    ranges={bookingData.dates}
                    onChange={(ranges) => handleInputChange('dates', [ranges.selection])}
                    minDate={new Date()}
                    className="dateRangePicker"
                    rangeColors={['#2563eb']}
                  />
                  {errors.dates && <span className="bookingError">{errors.dates}</span>}
                </div>

                <div className="guestsRoomsGrid">
                  <div className="guestSelector">
                    <label>Adults</label>
                    <div className="counterGroup">
                      <button type="button" onClick={() => handleNestedInputChange('guests', 'adults', Math.max(1, bookingData.guests.adults - 1))}>-</button>
                      <span>{bookingData.guests.adults}</span>
                      <button type="button" onClick={() => handleNestedInputChange('guests', 'adults', bookingData.guests.adults + 1)}>+</button>
                    </div>
                  </div>
                  <div className="guestSelector">
                    <label>Children</label>
                    <div className="counterGroup">
                      <button type="button" onClick={() => handleNestedInputChange('guests', 'children', Math.max(0, bookingData.guests.children - 1))}>-</button>
                      <span>{bookingData.guests.children}</span>
                      <button type="button" onClick={() => handleNestedInputChange('guests', 'children', bookingData.guests.children + 1)}>+</button>
                    </div>
                  </div>
                  <div className="guestSelector">
                    <label>Rooms</label>
                    <div className="counterGroup">
                      <button type="button" onClick={() => handleInputChange('rooms', Math.max(1, bookingData.rooms - 1))}>-</button>
                      <span>{bookingData.rooms}</span>
                      <button type="button" onClick={() => handleInputChange('rooms', bookingData.rooms + 1)}>+</button>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="priceSummary">
                  <h4>Price Summary</h4>
                  <div className="priceBreakdown">
                    <div className="priceItem">
                      <span>₹{hotel?.prices} × {bookingData.rooms} room × {priceBreakdown.nights} night</span>
                      <span>₹{priceBreakdown.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="priceItem">
                      <span>Taxes & fees</span>
                      <span>₹{(priceBreakdown.taxes + priceBreakdown.fees).toLocaleString()}</span>
                    </div>
                    <div className="priceTotal">
                      <span>Total</span>
                      <span>₹{priceBreakdown.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Guest Details */}
            {step === 2 && (
              <motion.div className="bookingStep" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <h3>Guest Information</h3>
                <div className="formGrid">
                  <div className="formGroup">
                    <label>First Name</label>
                    <input type="text" value={bookingData.guestDetails.firstName} onChange={(e) => handleNestedInputChange('guestDetails', 'firstName', e.target.value)} className={errors.firstName ? 'error' : ''} />
                    {errors.firstName && <span className="bookingError">{errors.firstName}</span>}
                  </div>
                  <div className="formGroup">
                    <label>Last Name</label>
                    <input type="text" value={bookingData.guestDetails.lastName} onChange={(e) => handleNestedInputChange('guestDetails', 'lastName', e.target.value)} className={errors.lastName ? 'error' : ''} />
                    {errors.lastName && <span className="bookingError">{errors.lastName}</span>}
                  </div>
                  <div className="formGroup">
                    <label>Email</label>
                    <input type="email" value={bookingData.guestDetails.email} onChange={(e) => handleNestedInputChange('guestDetails', 'email', e.target.value)} className={errors.email ? 'error' : ''} />
                    {errors.email && <span className="bookingError">{errors.email}</span>}
                  </div>
                  <div className="formGroup">
                    <label>Phone</label>
                    <input type="tel" value={bookingData.guestDetails.phone} onChange={(e) => handleNestedInputChange('guestDetails', 'phone', e.target.value)} className={errors.phone ? 'error' : ''} />
                    {errors.phone && <span className="bookingError">{errors.phone}</span>}
                  </div>
                </div>
                <div className="formGroup fullWidth">
                  <label>Special Requests (Optional)</label>
                  <textarea rows="3" value={bookingData.guestDetails.specialRequests} onChange={(e) => handleNestedInputChange('guestDetails', 'specialRequests', e.target.value)} />
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment Initializer */}
            {step === 3 && (
              <motion.div className="bookingStep" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <div className="securePaymentContainer" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: '48px', color: '#10b981', marginBottom: '20px' }} />
                  <h3>Secure Final Checkout</h3>
                  <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>
                    We use Razorpay to securely process your Credit Card, UPI, and Netbanking payments. Your sensitive details never touch our servers.
                  </p>
                  
                  <div className="finalPriceSummary" style={{ textAlign: "left", marginBottom: "30px", background: "var(--glass-bg)" }}>
                    <h4>Booking Summary</h4>
                    <div className="summaryDetails">
                      <div className="summaryRow">
                        <span>Hotel:</span>
                        <span>{hotel?.name}</span>
                      </div>
                      <div className="summaryRow">
                        <span>Dates:</span>
                        <span>{format(bookingData.dates[0].startDate, 'MMM dd')} - {format(bookingData.dates[0].endDate, 'MMM dd')}</span>
                      </div>
                      <div className="summaryRow total">
                        <span>Amount to Pay:</span>
                        <span>₹{priceBreakdown.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {errors.payment && (
                    <div className="bookingError paymentError" style={{ marginBottom: "20px" }}>
                      <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.payment}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <motion.div className="bookingStep confirmationStep" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                <div className="successIcon"><FontAwesomeIcon icon={faCheckCircle} /></div>
                <h3>Payment Successful!</h3>
                <p>Your booking has been successfully verified cryptographically and confirmed.</p>
                <div className="confirmationDetails">
                  <p><strong>Booking Reference:</strong> BK{Date.now()}</p>
                  <p><strong>Hotel:</strong> {hotel?.name}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          {step < 4 && (
            <div className="bookingFooter">
              <div className="bookingPrice">
                <span className="priceLabel">Total:</span>
                <span className="priceAmount">₹{priceBreakdown.total.toLocaleString()}</span>
              </div>
              
              <div className="bookingActions">
                {step > 1 && (
                  <motion.button className="bookingBtn secondary" onClick={prevStep}>Back</motion.button>
                )}
                
                {step < 3 ? (
                  <motion.button className="bookingBtn primary" onClick={nextStep}>Continue</motion.button>
                ) : (
                  <motion.button
                    className="bookingBtn primary"
                    onClick={handleBooking}
                    disabled={loading}
                  >
                    {loading ? <><FontAwesomeIcon icon={faSpinner} spin /> Securing...</> : 'Pay Securely via Razorpay'}
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
