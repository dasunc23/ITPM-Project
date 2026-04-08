import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// Initialize Stripe with API key (only if available)
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_YOUR_SECRET_KEY_HERE') {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * CREATE PAYMENT INTENT
 * POST /api/payments/create-intent
 */
export const createPaymentIntent = async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(500).json({
        success: false,
        error: "Payment gateway not configured. Please set up Stripe API keys.",
      });
    }

    const { userId, amount, type, description } = req.body;

    // Validation
    if (!userId || !amount || !type) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, amount, type",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be greater than 0",
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        userId,
        transactionType: type,
        userEmail: user.email,
      },
    });

    // Create transaction record
    const transaction = new Transaction({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      type,
      status: "PENDING",
      description: description || `${type} - ${amount} USD`,
    });

    await transaction.save();

    // Return client secret for frontend
    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      transactionId: transaction._id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create payment intent",
    });
  }
};

/**
 * CONFIRM PAYMENT
 * POST /api/payments/confirm
 */
export const confirmPayment = async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(500).json({
        success: false,
        error: "Payment gateway not configured. Please set up Stripe API keys.",
      });
    }

    const { paymentIntentId, transactionId } = req.body;

    if (!paymentIntentId || !transactionId) {
      return res.status(400).json({
        success: false,
        error: "Missing paymentIntentId or transactionId",
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        error: `Payment not completed. Status: ${paymentIntent.status}`,
      });
    }

    // Update transaction status
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: "COMPLETED",
        stripeChargeId: paymentIntent.charges.data[0]?.id,
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      transaction: {
        id: transaction._id,
        status: transaction.status,
        amount: transaction.amount,
        type: transaction.type,
      },
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to confirm payment",
    });
  }
};

/**
 * GET TRANSACTION STATUS
 * GET /api/payments/status/:transactionId
 */
export const getTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      transaction: {
        id: transaction._id,
        status: transaction.status,
        amount: transaction.amount,
        type: transaction.type,
        createdAt: transaction.createdAt,
        description: transaction.description,
      },
    });
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch transaction status",
    });
  }
};
