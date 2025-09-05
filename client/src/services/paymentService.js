// Payment Service for handling payment processing
import api from "./api";

class PaymentService {
  // Initialize payment session
  async initializePayment(paymentData) {
    try {
      const response = await api.post("/payments/initialize", paymentData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Payment initialization failed"
      );
    }
  }

  // Process credit card payment
  async processCreditCardPayment(paymentData) {
    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate payment validation
      if (this.validateCreditCard(paymentData.cardNumber)) {
        return {
          success: true,
          transactionId: this.generateTransactionId(),
          message: "Payment processed successfully",
        };
      } else {
        throw new Error("Invalid credit card information");
      }
    } catch (error) {
      throw new Error(error.message || "Credit card payment failed");
    }
  }

  // Process PayPal payment
  async processPayPalPayment(paymentData) {
    try {
      // Simulate PayPal processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        success: true,
        transactionId: this.generateTransactionId(),
        message: "PayPal payment processed successfully",
        paypalTransactionId: `PP${Date.now()}`,
      };
    } catch (error) {
      throw new Error("PayPal payment failed");
    }
  }

  // Process UPI payment
  async processUPIPayment(paymentData) {
    try {
      // Simulate UPI processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        transactionId: this.generateTransactionId(),
        message: "UPI payment processed successfully",
        upiTransactionId: `UPI${Date.now()}`,
      };
    } catch (error) {
      throw new Error("UPI payment failed");
    }
  }

  // Validate credit card (basic validation)
  validateCreditCard(cardNumber) {
    // Remove spaces and dashes
    const cleanNumber = cardNumber.replace(/[\s-]/g, "");

    // Check if it's a valid number
    if (!/^\d{13,19}$/.test(cleanNumber)) return false;

    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  // Validate card expiry
  validateCardExpiry(month, year) {
    const now = new Date();
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiry > now;
  }

  // Validate CVV
  validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
  }

  // Generate transaction ID
  generateTransactionId() {
    return `TXN${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;
  }

  // Get card type
  getCardType(cardNumber) {
    const cleanNumber = cardNumber.replace(/[\s-]/g, "");

    if (/^4/.test(cleanNumber)) return "visa";
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
    if (/^3[47]/.test(cleanNumber)) return "amex";
    if (/^6/.test(cleanNumber)) return "discover";
    return "unknown";
  }

  // Calculate processing fee
  calculateProcessingFee(amount, paymentMethod) {
    const fees = {
      credit_card: amount * 0.029 + 0.3, // 2.9% + $0.30
      paypal: amount * 0.034, // 3.4%
      upi: amount * 0.01, // 1%
      debit_card: amount * 0.019 + 0.2, // 1.9% + $0.20
    };

    return Math.round((fees[paymentMethod] || 0) * 100) / 100;
  }

  // Format amount for display
  formatAmount(amount, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Verify payment status
  async verifyPayment(transactionId) {
    try {
      const response = await api.get(`/payments/verify/${transactionId}`);
      return response.data;
    } catch (error) {
      throw new Error("Payment verification failed");
    }
  }

  // Refund payment
  async refundPayment(transactionId, amount, reason) {
    try {
      const response = await api.post("/payments/refund", {
        transactionId,
        amount,
        reason,
      });
      return response.data;
    } catch (error) {
      throw new Error("Refund processing failed");
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
