import mongoose from "mongoose";

/**
 * Transaction Model - Stores all payment transactions
 */
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "usd",
    },
    type: {
      type: String,
      enum: ["GAME_ENTRY", "CREDIT_PURCHASE"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED"],
      default: "PENDING",
    },
    description: {
      type: String,
    },
    metadata: {
      gameId: String,
      roomCode: String,
      creditsAmount: Number,
    },
    stripeChargeId: String,
    errorMessage: String,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
