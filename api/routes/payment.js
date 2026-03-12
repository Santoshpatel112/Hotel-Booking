import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import {
  createOrder,
  verifyPayment,
  getPublicKey,
} from "../controllers/payment.js";

dotenv.config();
const router = express.Router();

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay credentials missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment."
    );
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Routes using controller functions
router.get("/key", getPublicKey);
router.post("/order", createOrder);
router.post("/verify", verifyPayment);

// Additional Razorpay route (alternative to /order)
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const razorpayInstance = getRazorpayInstance();
    const order = await razorpayInstance.orders.create({
      amount: Math.round(Number(amount) * 100), // Convert to paise
      currency: "INR",
    });

    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: error.message || "Error creating order" });
  }
});

// Test Razorpay connection
router.get("/test-razorpay", async (req, res) => {
  try {
    const razorpayInstance = getRazorpayInstance();

    // Test creating a small order
    const testOrder = await razorpayInstance.orders.create({
      amount: 100, // ₹1.00 in paise
      currency: "INR",
      receipt: `test_${Date.now()}`,
      notes: {
        test: "Razorpay connection test"
      }
    });

    res.json({
      success: true,
      message: "✅ Razorpay testnet connection successful!",
      credentials: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET ? "✅ Present" : "❌ Missing"
      },
      testOrder: {
        id: testOrder.id,
        amount: testOrder.amount,
        currency: testOrder.currency,
        status: testOrder.status,
        created_at: new Date(testOrder.created_at * 1000).toISOString()
      },
      environment: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_') ? 'TEST' : 'LIVE'
    });

  } catch (error) {
    console.error("Razorpay test error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to connect to Razorpay",
      details: error.message,
      credentials: {
        keyId: process.env.RAZORPAY_KEY_ID ? "✅ Present" : "❌ Missing",
        keySecret: process.env.RAZORPAY_KEY_SECRET ? "✅ Present" : "❌ Missing"
      }
    });
  }
});

export default router;
