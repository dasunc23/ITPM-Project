# Payment Gateway Integration

This project includes a complete Stripe payment gateway integration for game-related purchases.

## Features

- ✅ Secure payment processing with Stripe
- ✅ Support for game entry fees and credit purchases
- ✅ Transaction tracking and status monitoring
- ✅ Frontend payment form with Stripe Elements
- ✅ Backend API endpoints for payment operations
- ✅ MongoDB transaction storage

## Setup Instructions

### 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Go to **Developers** → **API keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

### 2. Configure Environment Variables

Update `backend/.env` file:

```env
# Replace with your actual Stripe keys
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY
```

### 3. Start the Application

```bash
# Backend
cd backend
npm start

# Frontend (in another terminal)
cd frontend
npm start
```

### 4. Test the Payment Gateway

1. Visit `http://localhost:3000/payment`
2. Log in to your account first
3. Select payment type and amount
4. Use Stripe test card: `4242 4242 4242 4242`
5. Any future expiry date and any CVC

## API Endpoints

### Create Payment Intent
```
POST /api/payments/create-intent
Body: { userId, amount, type, description }
```

### Confirm Payment
```
POST /api/payments/confirm
Body: { paymentIntentId, transactionId }
```

### Get Transaction Status
```
GET /api/payments/status/:transactionId
```

## Payment Types

- `GAME_ENTRY`: For game entry fees
- `CREDIT_PURCHASE`: For buying in-game credits

## Database Schema

### Transaction Model
```javascript
{
  userId: ObjectId,           // Reference to User
  stripePaymentIntentId: String, // Unique Stripe ID
  amount: Number,             // Amount in USD
  currency: String,           // Default: 'usd'
  type: String,               // 'GAME_ENTRY' or 'CREDIT_PURCHASE'
  status: String,             // 'PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'
  description: String,        // Human-readable description
  metadata: Object,           // Additional data (gameId, roomCode, etc.)
  stripeChargeId: String,     // Stripe charge ID
  errorMessage: String,       // Error details if failed
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- ✅ Server-side Stripe key validation
- ✅ Payment intent verification
- ✅ Transaction status tracking
- ✅ User authentication required
- ✅ Amount validation
- ✅ Duplicate transaction prevention

## Testing

Use these Stripe test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

All test cards use any future expiry date and any 3-digit CVC.

## File Structure

```
backend/
├── controllers/
│   └── paymentController.js    # Payment logic
├── models/
│   └── Transaction.js          # Transaction schema
├── routes/
│   └── paymentRoutes.js        # Payment API routes
└── .env                        # Environment variables

frontend/
├── Components/
│   └── PaymentForm.jsx         # Stripe payment form
└── Pages/
    └── PaymentPage.jsx         # Payment demo page
```

## Troubleshooting

### Backend won't start
- Check that Stripe keys are properly set in `.env`
- Ensure MongoDB connection is working
- Check for syntax errors in payment controller

### Payment fails
- Verify Stripe keys are correct
- Check that user is logged in
- Ensure amount is greater than 0
- Check browser console for JavaScript errors

### Frontend not loading
- Make sure backend is running on port 5000
- Check CORS settings
- Verify all dependencies are installed

## Production Deployment

1. Use live Stripe keys (remove `_test_` from keys)
2. Set up webhook endpoints for production
3. Enable SSL/HTTPS
4. Configure proper error logging
5. Set up monitoring and alerts