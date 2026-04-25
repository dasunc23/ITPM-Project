import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from '../Components/PaymentForm';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentContext = location.state || {};
  const access = paymentContext.access;

  const [amount] = useState(32.5);
  const [currency] = useState('USD');
  const description = useMemo(() => {
    if (paymentContext.source === 'game-entry' && paymentContext.game?.name) {
      return `Unlimited game access for ${paymentContext.game.name}`;
    }
    return 'Game entry fee';
  }, [paymentContext.game?.name, paymentContext.source]);
  const [paymentResult, setPaymentResult] = useState(null);
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States'
  });

  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    return user?._id;
  };

  const handlePaymentSuccess = (transaction) => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify({
        ...user,
        hasPaidGameAccess: true,
      }));
    }

    setPaymentResult({
      success: true,
      transaction,
      message: 'Your payment was successful.',
    });
  };

  const handleBillingChange = (e) => {
    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSuccessNavigation = () => {
    navigate(paymentContext.returnTo || '/home', { state: paymentContext.returnState });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white font-sans selection:bg-purple-200">
      <div className="lg:w-2/5 bg-[#0f1015] text-white p-8 lg:p-12 xl:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-md mx-auto lg:mx-0">
          <div className="flex items-center gap-2 mb-16 cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <span className="text-xl font-bold tracking-wide">GameHub</span>
          </div>

          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">Total to pay</p>
          <div className="flex items-end gap-3 mb-10 border-b border-gray-800 pb-10">
            <h1 className="text-6xl font-light tracking-tight">${amount.toFixed(2)}</h1>
            <span className="text-2xl text-gray-400 mb-2 font-light">{currency}</span>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-100">{description}</h3>
                  <p className="text-sm text-gray-500">Premium Digital Access</p>
                </div>
              </div>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-100">Platform Tax</h3>
                  <p className="text-sm text-gray-500">Included in total</p>
                </div>
              </div>
              <span className="font-medium text-gray-400">$0.00</span>
            </div>
          </div>

          {paymentContext.source === 'game-entry' ? (
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
              <p className="font-semibold text-white">Game access required</p>
              <p className="mt-2 text-slate-300">
                You have used {access?.freePlaysUsed ?? 5} of {access?.freePlayLimit ?? 5} free game entries.
                Complete payment once to keep entering games without the free-play limit.
              </p>
            </div>
          ) : null}
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto lg:mx-0 mt-20 text-sm text-gray-500 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            SSL Secure Encryption
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
            PCI DSS Compliant Checkout
          </div>
        </div>
      </div>

      <div className="lg:w-3/5 bg-[#fafafa] lg:h-screen lg:overflow-y-auto w-full">
        <div className="max-w-2xl mx-auto p-8 lg:p-12 xl:p-16">
          {paymentResult ? (
            <div className="bg-white border flex flex-col items-center justify-center text-center border-green-100 p-12 rounded-3xl shadow-xl shadow-green-500/10 mt-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
              <p className="text-gray-500 mb-8 max-w-sm">Thank you for your purchase. Your premium digital access has been granted to your account immediately.</p>
              {paymentResult.transaction && (
                <div className="bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 text-sm mb-8 w-full max-w-sm">
                  <div className="flex justify-between text-gray-500 mb-2"><span>Transaction ID</span><span className="font-mono text-gray-800">{paymentResult.transaction.id}</span></div>
                  <div className="flex justify-between text-gray-500 mb-2"><span>Amount Paid</span><span className="font-semibold text-gray-800">${amount.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Date</span><span className="text-gray-800">{new Date().toLocaleDateString()}</span></div>
                </div>
              )}
              <button onClick={handleSuccessNavigation} className="bg-gray-900 text-white font-medium px-8 py-3 rounded-full hover:bg-purple-600 transition-colors shadow-lg shadow-gray-900/20">
                {paymentContext.returnTo ? 'Continue to Game' : 'Return to GameHub'}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                <p className="text-gray-500 mt-1 text-sm">Please fill out your billing information to proceed.</p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</div>
                  Billing Details
                </h3>

                <div className="grid gap-x-6 gap-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={billingInfo.email}
                      onChange={handleBillingChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={billingInfo.name}
                      onChange={handleBillingChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={billingInfo.address}
                      onChange={handleBillingChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</label>
                      <input
                        type="text"
                        name="city"
                        value={billingInfo.city}
                        onChange={handleBillingChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ZIP / Postal</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={billingInfo.zipCode}
                        onChange={handleBillingChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</label>
                    <div className="relative">
                      <select
                        name="country"
                        value={billingInfo.country}
                        onChange={handleBillingChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 appearance-none text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Germany</option>
                        <option>France</option>
                        <option>Australia</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</div>
                  Payment Method
                </h3>

                <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50/50 mb-6 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 focus-within:bg-white transition-all">
                  <PaymentForm
                    userId={getCurrentUserId()}
                    amount={amount}
                    type="GAME_ENTRY"
                    description={description}
                    onSuccess={handlePaymentSuccess}
                  />
                </div>

                <div className="flex items-start bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-offset-gray-50 transition-colors cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-500 cursor-pointer">
                      I agree to GameHub's{' '}
                      <a href="#!" className="text-gray-800 font-medium hover:text-purple-600 transition-colors underline decoration-gray-300 underline-offset-2 hover:decoration-purple-600">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#!" className="text-gray-800 font-medium hover:text-purple-600 transition-colors underline decoration-gray-300 underline-offset-2 hover:decoration-purple-600">Privacy Policy</a>.
                    </label>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 mt-8 mb-4">
                &copy; {new Date().getFullYear()} GameHub. All rights reserved.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
