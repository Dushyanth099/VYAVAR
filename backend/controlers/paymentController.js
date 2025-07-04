import Razorpay from "razorpay";
import asyncHandler from "express-async-handler";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body; // amount in rupees

  const options = {
    amount: amount * 100, // convert to paise
    currency: "INR",
    receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
});
export { createRazorpayOrder };
