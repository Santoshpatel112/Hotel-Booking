import React, { useEffect, useState } from "react";

// Utility to dynamically load Razorpay script
const useRazorpayScript = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (document.getElementById('razorpay-js')) {
      setLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setLoaded(false);
    document.body.appendChild(script);
  }, []);
  return loaded;
};

/**
 * RazorpayButton
 * props:
 * - amount: number (in INR, e.g., 999.99 or 999)
 * - customer: { name, email, contact }
 * - notes: object
 * - onSuccess(paymentData)
 * - onError(error)
 */
export default function RazorpayButton({ amount, customer = {}, notes = {}, onSuccess, onError, label = "Pay Now" }) {
  const scriptReady = useRazorpayScript();
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    const res = await fetch('/api/payment/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: 'INR', notes })
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  };

  const fetchKey = async () => {
    const res = await fetch('/api/payment/key');
    if (!res.ok) throw new Error('Failed to fetch key');
    const data = await res.json();
    return data.key;
  };

  const verifyPayment = async (payload) => {
    const res = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Verification failed');
    return res.json();
  };

  const openCheckout = async () => {
    try {
      setLoading(true);
      const [order, key] = await Promise.all([createOrder(), fetchKey()]);

      const options = {
        key,
        amount: order.amount, // in paise
        currency: order.currency,
        name: 'EasyStay',
        description: 'Hotel Booking Payment',
        order_id: order.id,
        prefill: {
          name: customer.name || 'Guest User',
          email: customer.email || 'guest@example.com',
          contact: customer.contact || '9999999999'
        },
        notes,
        theme: { color: '#2563EB' },
        handler: async function (response) {
          try {
            const verify = await verifyPayment(response);
            if (verify?.verified) {
              onSuccess && onSuccess({ order, response });
            } else {
              throw new Error('Signature verification failed');
            }
          } catch (err) {
            onError && onError(err);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        onError && onError(resp.error);
      });
      rzp.open();
    } catch (err) {
      onError && onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={openCheckout}
      disabled={!scriptReady || loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
        !scriptReady || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {loading ? 'Processing…' : label}
    </button>
  );
}


