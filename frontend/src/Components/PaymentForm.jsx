import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ userId, amount, type, description, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [cardLoaded, setCardLoaded] = useState(false);
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState('2026');
  const [stripeInstance, setStripeInstance] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const cardElementRef = useRef(null);

  useEffect(() => {
    if (paymentIntent && window.Stripe && !stripeInstance) {
      initializeStripeElements(paymentIntent.publishableKey);
    }
  }, [paymentIntent]);

  const initializePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/payments/create-intent', {
        userId,
        amount,
        type,
        description,
      });

      if (response.data.success) {
        setPaymentIntent(response.data);
      } else {
        setError(response.data.error || 'Unable to start payment');
      }
    } catch (err) {
      setError('Failed to initialize payment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStripeScript = (publishableKey) => {
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => initializeStripeElements(publishableKey);
      document.head.appendChild(script);
    } else {
      initializeStripeElements(publishableKey);
    }
  };

  const initializeStripeElements = (publishableKey) => {
    const stripe = window.Stripe(publishableKey);
    const elements = stripe.elements();

    const card = elements.create('card', {
      style: {
        base: {
          color: '#0f172a',
          fontSize: '16px',
          fontFamily: 'Inter, system-ui, sans-serif',
          '::placeholder': {
            color: '#94a3b8',
          },
        },
        invalid: {
          color: '#ef4444',
        },
      },
      hidePostalCode: true,
    });

    card.mount(cardElementRef.current);
    setStripeInstance(stripe);
    setCardElement(card);
    setCardLoaded(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!paymentIntent) {
      await initializePayment();
      return;
    }

    if (!stripeInstance || !cardElement) {
      setError('Card input is not ready yet');
      return;
    }

    setLoading(true);

    const { error: stripeError, paymentIntent: confirmedPaymentIntent } = await stripeInstance.confirmCardPayment(
      paymentIntent.clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${firstName} ${lastName}`,
          },
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/payments/confirm', {
        paymentIntentId: confirmedPaymentIntent.id,
        transactionId: paymentIntent.transactionId,
      });

      if (response.data.success) {
        onSuccess(response.data.transaction);
      } else {
        setError(response.data.error || 'Payment confirmation failed');
      }
    } catch (err) {
      setError('Failed to confirm payment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPayment = async () => {
    if (!userId) {
      setError('Please log in to continue');
      return;
    }
    await initializePayment();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">First name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Last name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Card number</label>
        <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm" ref={cardElementRef} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
          <input
            type="text"
            value="***"
            disabled
            className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Valid until</label>
          <div className="flex gap-3">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-1/2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
            >
              {Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: String(i + 1).padStart(2, '0') })).map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-1/2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
            >
              {Array.from({ length: 8 }, (_, i) => {
                const y = new Date().getFullYear() + i;
                return { value: String(y), label: String(y) };
              }).map((y) => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Security</label>
          <div className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-600">
            Secure processing
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleStartPayment}
          disabled={loading || !!paymentIntent}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {paymentIntent ? 'Ready to submit' : 'Start payment'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !paymentIntent}
          className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
