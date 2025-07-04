// routes/paymentRoutes.js
import express from "express";
const router = express.Router();
import { createRazorpayOrder } from "../controlers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/create-order").post(protect, createRazorpayOrder);

export default router;
