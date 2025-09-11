import React from 'react';
import axios from 'axios';

const loadRazorpayScript = () => 
  new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const handleRazorpayPayment = async () => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  try {
    // Step 1: Call your backend to create an order
    const { data: order } = await axios.post('http://localhost:5000/api/payment/create-order', {
      amount: 500,  // Amount in INR
    });

    // Step 2: Configure Razorpay options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,  // Test API Key ID from Razorpay dashboard
      amount: order.amount,
      currency: 'INR',
      name: 'Your App Name',
      description: 'Test Payment',
      order_id: order.id,
      handler: function (response) {
        console.log('Payment Success:', response);
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error('Order creation failed', error);
    alert('Could not create order. Check server.');
  }
};

const PaymentButton = () => {
  return (
    <button onClick={handleRazorpayPayment} className="bg-blue-500 text-white p-2 rounded">
      Pay ₹500 (Test)
    </button>
  );
};

export default PaymentButton;