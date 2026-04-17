import dotenv from "dotenv";
import crypto from "crypto";
import Razorpay from "razorpay";

dotenv.config();

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

export const getPublicKey = (req, res) => {
  if (!RAZORPAY_KEY_ID) {
    return res.status(500).json({ error: "Missing RAZORPAY_KEY_ID" });
  }
  return res.json({ key: RAZORPAY_KEY_ID });
};

const getClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials not configured in backend .env");
  }
  return new Razorpay({ key_id, key_secret });
};

// Create an order in Razorpay (amount in INR rupees on client; convert to paise here)
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body || {};
    if (!amount || Number.isNaN(Number(amount))) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // 🔥 MOCK MODE: Bypass invalid keys for local testing
    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_SQOF60ZLc9p3o1') {
      console.log("⚠️ USING MOCK RAZORPAY MODE DUE TO INVALID KEYS");
      return res.json({
        id: "order_mock_" + Date.now(),
        amount: Math.round(Number(amount) * 100),
        currency,
        isMock: true // Signal frontend to bypass Razorpay SDK
      });
    }

    const rzp = getClient();
    const order = await rzp.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });
    return res.json(order);
  } catch (err) {
    console.error("Razorpay createOrder error:", err);
    if (err.statusCode === 401 || err.error?.description === 'Authentication failed') {
      return res.status(401).json({
        error: "Razorpay Test Keys are Invalid/Revoked",
        details: "Please log into the Razorpay Dashboard (https://dashboard.razorpay.com/), generate a new pair of Test API Keys, and update your api/.env and client/.env files."
      });
    }
    return res.status(500).json({ error: "Failed to create order. " + (err.error?.description || err.message) });
  }
};

// Verify payment signature sent from client after checkout success
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    // 🔥 MOCK MODE: Bypass invalid keys cryptographic verification
    if (razorpay_order_id && razorpay_order_id.startsWith("order_mock_")) {
      return res.json({ verified: true });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET || "")
      .update(payload)
      .digest("hex");
    const isValid = expectedSignature === razorpay_signature;
    if (!isValid) {
      return res.status(400).json({ verified: false, error: "Invalid signature" });
    }
    return res.json({ verified: true });
  } catch (err) {
    console.error("Razorpay verifyPayment error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
};


