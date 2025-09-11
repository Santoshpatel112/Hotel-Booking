require('dotenv').config();
const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpayInstance.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
    });

    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).send('Error creating order');
  }
});

module.exports = router;