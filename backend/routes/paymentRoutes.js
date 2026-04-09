import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getTransactionStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * PAYMENT ROUTES
 */

// Create payment intent
router.post("/create-intent", createPaymentIntent);

// Confirm payment after completion
router.post("/confirm", confirmPayment);

// Get transaction status
router.get("/status/:transactionId", getTransactionStatus);

export default router;
