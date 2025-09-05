import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCheckCircle,
  faExclamationTriangle,
  faCreditCard,
  faSpinner,
  faMapMarkerAlt,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

import paymentService from '../../services/paymentService';
import './booking.css';

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
    guests: {
      adults: 1,
      children: 0
    },
    rooms: 1,
    guestDetails: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      specialRequests: ''
    },
    paymentMethod: 'credit_card',
    paymentDetails: {
      cardNumber: '',
      cardHolder: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      upiId: ''
    }
  });

  const [priceBreakdown, setPriceBreakdown] = useState({
    basePrice: 0,
    taxes: 0,
    fees: 0,
    total: 0,
    nights: 1
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

      setPriceBreakdown({
        basePrice,
        taxes,
        fees,
        total,
        nights
      });
    }
  }, [hotel, bookingData.dates, bookingData.rooms]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setBookingData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!bookingData.dates[0].startDate || !bookingData.dates[0].endDate) {
        newErrors.dates = 'Please select check-in and check-out dates';
      }
      if (bookingData.guests.adults < 1) {
        newErrors.guests = 'At least 1 adult is required';
      }
      if (bookingData.rooms < 1) {
        newErrors.rooms = 'At least 1 room is required';
      }
    }

    if (stepNumber === 2) {
      if (!bookingData.guestDetails.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!bookingData.guestDetails.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!bookingData.guestDetails.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(bookingData.guestDetails.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!bookingData.guestDetails.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    }

    if (stepNumber === 3) {
      if (bookingData.paymentMethod === 'credit_card') {
        if (!bookingData.paymentDetails.cardNumber.trim()) {
          newErrors.cardNumber = 'Card number is required';
        } else if (!paymentService.validateCreditCard(bookingData.paymentDetails.cardNumber)) {
          newErrors.cardNumber = 'Invalid card number';
        }
        
        if (!bookingData.paymentDetails.cardHolder.trim()) {
          newErrors.cardHolder = 'Cardholder name is required';
        }
        
        if (!bookingData.paymentDetails.expiryMonth || !bookingData.paymentDetails.expiryYear) {
          newErrors.expiry = 'Expiry date is required';
        } else if (!paymentService.validateCardExpiry(bookingData.paymentDetails.expiryMonth, bookingData.paymentDetails.expiryYear)) {
          newErrors.expiry = 'Card has expired';
        }
        
        if (!bookingData.paymentDetails.cvv.trim()) {
          newErrors.cvv = 'CVV is required';
        } else if (!paymentService.validateCVV(bookingData.paymentDetails.cvv)) {
          newErrors.cvv = 'Invalid CVV';
        }
      } else if (bookingData.paymentMethod === 'upi') {
        if (!bookingData.paymentDetails.upiId.trim()) {
          newErrors.upiId = 'UPI ID is required';
        } else if (!/^[a-zA-Z0-9.\-_]+@[a-zA-Z]+$/.test(bookingData.paymentDetails.upiId)) {
          newErrors.upiId = 'Invalid UPI ID format';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setErrors({});
  };

  const handleBooking = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      let paymentResult;
      
      // Process payment based on selected method
      if (bookingData.paymentMethod === 'credit_card') {
        paymentResult = await paymentService.processCreditCardPayment({
          cardNumber: bookingData.paymentDetails.cardNumber,
          cardHolder: bookingData.paymentDetails.cardHolder,
          expiryMonth: bookingData.paymentDetails.expiryMonth,
          expiryYear: bookingData.paymentDetails.expiryYear,
          cvv: bookingData.paymentDetails.cvv,
          amount: priceBreakdown.total
        });
      } else if (bookingData.paymentMethod === 'paypal') {
        paymentResult = await paymentService.processPayPalPayment({
          amount: priceBreakdown.total
        });
      } else if (bookingData.paymentMethod === 'upi') {
        paymentResult = await paymentService.processUPIPayment({
          upiId: bookingData.paymentDetails.upiId,
          amount: priceBreakdown.total
        });
      }
      
      if (paymentResult.success) {
        // Create booking record (simulate API call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStep(4); // Success step
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose();
        }, 3000);
      }
      
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ payment: error.message || 'Booking failed. Please try again.' });
    }
    setLoading(false);
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
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                {hotel?.city}
              </p>
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
                  {step > num ? (
                    <FontAwesomeIcon icon={faCheckCircle} />
                  ) : (
                    num
                  )}
                </div>
                <span>
                  {num === 1 && 'Dates & Guests'}
                  {num === 2 && 'Guest Details'}
                  {num === 3 && 'Payment'}
                  {num === 4 && 'Confirmation'}
                </span>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="bookingContent">
            {/* Step 1: Dates & Guests */}
            {step === 1 && (
              <motion.div
                className="bookingStep"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <h3>Select Dates & Guests</h3>
                
                <div className="dateSelection">
                  <label>Check-in & Check-out Dates</label>
                  <DateRange
                    ranges={bookingData.dates}
                    onChange={(ranges) => handleInputChange('dates', [ranges.selection])}
                    minDate={new Date()}
                    className="dateRangePicker"
                    rangeColors={['#667eea']}
                  />
                  {errors.dates && <span className="bookingError">{errors.dates}</span>}
                </div>

                <div className="guestsRoomsGrid">
                  <div className="guestSelector">
                    <label>Adults</label>
                    <div className="counterGroup">
                      <button 
                        type="button"
                        onClick={() => handleNestedInputChange('guests', 'adults', Math.max(1, bookingData.guests.adults - 1))}
                        disabled={bookingData.guests.adults <= 1}
                      >
                        -
                      </button>
                      <span>{bookingData.guests.adults}</span>
                      <button 
                        type="button"
                        onClick={() => handleNestedInputChange('guests', 'adults', bookingData.guests.adults + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="guestSelector">
                    <label>Children</label>
                    <div className="counterGroup">
                      <button 
                        type="button"
                        onClick={() => handleNestedInputChange('guests', 'children', Math.max(0, bookingData.guests.children - 1))}
                        disabled={bookingData.guests.children <= 0}
                      >
                        -
                      </button>
                      <span>{bookingData.guests.children}</span>
                      <button 
                        type="button"
                        onClick={() => handleNestedInputChange('guests', 'children', bookingData.guests.children + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="guestSelector">
                    <label>Rooms</label>
                    <div className="counterGroup">
                      <button 
                        type="button"
                        onClick={() => handleInputChange('rooms', Math.max(1, bookingData.rooms - 1))}
                        disabled={bookingData.rooms <= 1}
                      >
                        -
                      </button>
                      <span>{bookingData.rooms}</span>
                      <button 
                        type="button"
                        onClick={() => handleInputChange('rooms', bookingData.rooms + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="priceSummary">
                  <h4>Price Summary</h4>
                  <div className="priceBreakdown">
                    <div className="priceItem">
                      <span>₹{hotel?.prices} × {bookingData.rooms} room(s) × {priceBreakdown.nights} night(s)</span>
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
              <motion.div
                className="bookingStep"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <h3>Guest Information</h3>
                
                <div className="formGrid">
                  <div className="formGroup">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={bookingData.guestDetails.firstName}
                      onChange={(e) => handleNestedInputChange('guestDetails', 'firstName', e.target.value)}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="bookingError">{errors.firstName}</span>}
                  </div>

                  <div className="formGroup">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={bookingData.guestDetails.lastName}
                      onChange={(e) => handleNestedInputChange('guestDetails', 'lastName', e.target.value)}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="bookingError">{errors.lastName}</span>}
                  </div>

                  <div className="formGroup">
                    <label>Email</label>
                    <input
                      type="email"
                      value={bookingData.guestDetails.email}
                      onChange={(e) => handleNestedInputChange('guestDetails', 'email', e.target.value)}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="bookingError">{errors.email}</span>}
                  </div>

                  <div className="formGroup">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={bookingData.guestDetails.phone}
                      onChange={(e) => handleNestedInputChange('guestDetails', 'phone', e.target.value)}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="bookingError">{errors.phone}</span>}
                  </div>
                </div>

                <div className="formGroup fullWidth">
                  <label>Special Requests (Optional)</label>
                  <textarea
                    rows="3"
                    value={bookingData.guestDetails.specialRequests}
                    onChange={(e) => handleNestedInputChange('guestDetails', 'specialRequests', e.target.value)}
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                className="bookingStep"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <h3>Payment Details</h3>
                
                <div className="paymentMethods">
                  <label className="paymentOption">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={bookingData.paymentMethod === 'credit_card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <div className="paymentMethodCard">
                      <FontAwesomeIcon icon={faCreditCard} />
                      <span>Credit/Debit Card</span>
                    </div>
                  </label>
                  
                  <label className="paymentOption">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={bookingData.paymentMethod === 'upi'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <div className="paymentMethodCard">
                      <FontAwesomeIcon icon={faPhone} />
                      <span>UPI Payment</span>
                    </div>
                  </label>
                  
                  <label className="paymentOption">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={bookingData.paymentMethod === 'paypal'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <div className="paymentMethodCard">
                      <FontAwesomeIcon icon={faCreditCard} />
                      <span>PayPal</span>
                    </div>
                  </label>
                </div>
                
                {/* Payment Form Based on Selected Method */}
                {bookingData.paymentMethod === 'credit_card' && (
                  <div className="paymentForm">
                    <div className="formGrid">
                      <div className="formGroup fullWidth">
                        <label>Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={bookingData.paymentDetails.cardNumber}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                            if (value.length <= 19) {
                              handleNestedInputChange('paymentDetails', 'cardNumber', value);
                            }
                          }}
                          className={errors.cardNumber ? 'error' : ''}
                        />
                        {errors.cardNumber && <span className="bookingError">{errors.cardNumber}</span>}
                      </div>
                      
                      <div className="formGroup fullWidth">
                        <label>Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={bookingData.paymentDetails.cardHolder}
                          onChange={(e) => handleNestedInputChange('paymentDetails', 'cardHolder', e.target.value)}
                          className={errors.cardHolder ? 'error' : ''}
                        />
                        {errors.cardHolder && <span className="bookingError">{errors.cardHolder}</span>}
                      </div>
                      
                      <div className="formGroup">
                        <label>Expiry Month</label>
                        <select
                          value={bookingData.paymentDetails.expiryMonth}
                          onChange={(e) => handleNestedInputChange('paymentDetails', 'expiryMonth', e.target.value)}
                          className={errors.expiry ? 'error' : ''}
                        >
                          <option value="">Month</option>
                          {Array.from({length: 12}, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                        {errors.expiry && <span className="bookingError">{errors.expiry}</span>}
                      </div>
                      
                      <div className="formGroup">
                        <label>Expiry Year</label>
                        <select
                          value={bookingData.paymentDetails.expiryYear}
                          onChange={(e) => handleNestedInputChange('paymentDetails', 'expiryYear', e.target.value)}
                          className={errors.expiry ? 'error' : ''}
                        >
                          <option value="">Year</option>
                          {Array.from({length: 10}, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <option key={year} value={String(year).slice(-2)}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      
                      <div className="formGroup">
                        <label>CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={bookingData.paymentDetails.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                            handleNestedInputChange('paymentDetails', 'cvv', value);
                          }}
                          className={errors.cvv ? 'error' : ''}
                        />
                        {errors.cvv && <span className="bookingError">{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}
                
                {bookingData.paymentMethod === 'upi' && (
                  <div className="paymentForm">
                    <div className="formGroup">
                      <label>UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={bookingData.paymentDetails.upiId}
                        onChange={(e) => handleNestedInputChange('paymentDetails', 'upiId', e.target.value)}
                        className={errors.upiId ? 'error' : ''}
                      />
                      {errors.upiId && <span className="bookingError">{errors.upiId}</span>}
                    </div>
                  </div>
                )}
                
                {bookingData.paymentMethod === 'paypal' && (
                  <div className="paymentForm">
                    <div className="paypalInfo">
                      <p>You will be redirected to PayPal to complete your payment securely.</p>
                    </div>
                  </div>
                )}

                {/* Final Price Summary */}
                <div className="finalPriceSummary">
                  <h4>Booking Summary</h4>
                  <div className="summaryDetails">
                    <div className="summaryRow">
                      <span>Hotel:</span>
                      <span>{hotel?.name}</span>
                    </div>
                    <div className="summaryRow">
                      <span>Dates:</span>
                      <span>
                        {format(bookingData.dates[0].startDate, 'MMM dd')} - {format(bookingData.dates[0].endDate, 'MMM dd')}
                      </span>
                    </div>
                    <div className="summaryRow">
                      <span>Guests:</span>
                      <span>{bookingData.guests.adults} adults, {bookingData.guests.children} children</span>
                    </div>
                    <div className="summaryRow">
                      <span>Rooms:</span>
                      <span>{bookingData.rooms}</span>
                    </div>
                    <div className="summaryRow total">
                      <span>Total Amount:</span>
                      <span>₹{priceBreakdown.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {errors.payment && (
                  <div className="bookingError paymentError">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    {errors.payment}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <motion.div
                className="bookingStep confirmationStep"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="successIcon">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <h3>Booking Confirmed!</h3>
                <p>Your booking has been successfully confirmed. You will receive a confirmation email shortly.</p>
                
                <div className="confirmationDetails">
                  <p><strong>Booking Reference:</strong> BK{Date.now()}</p>
                  <p><strong>Hotel:</strong> {hotel?.name}</p>
                  <p><strong>Check-in:</strong> {format(bookingData.dates[0].startDate, 'MMM dd, yyyy')}</p>
                  <p><strong>Check-out:</strong> {format(bookingData.dates[0].endDate, 'MMM dd, yyyy')}</p>
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
                  <motion.button
                    className="bookingBtn secondary"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                )}
                
                {step < 3 ? (
                  <motion.button
                    className="bookingBtn primary"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue
                  </motion.button>
                ) : (
                  <motion.button
                    className="bookingBtn primary"
                    onClick={handleBooking}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
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
