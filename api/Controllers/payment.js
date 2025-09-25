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
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not configured");
  }
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
};

// Create an order in Razorpay (amount in INR rupees on client; convert to paise here)
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body || {};
    if (!amount || Number.isNaN(Number(amount))) {
      return res.status(400).json({ error: "Invalid amount" });
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
    return res.status(500).json({ error: "Failed to create order" });
  }
};

// Verify payment signature sent from client after checkout success
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
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


