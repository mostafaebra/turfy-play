import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { XCircle, AlertTriangle, RefreshCcw, Home } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Parse Error Details
  // Gateways often send error messages in query params (e.g., ?reason=insufficient_funds)
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get('message') || location.state?.message || "We couldn't process your payment.";
  const errorCode = queryParams.get('code') || location.state?.errorCode || "ERR_GENERIC";

  // 2. Retry Logic
  // Going back one step is usually the safest way to retry the payment
  // without losing the booking state (slots, date, etc.)
  const handleRetry = () => {
    navigate(-1); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
          <XCircle className="text-red-500 w-10 h-10" />
        </div>
        
        {/* Heading */}
        <h1 className="text-2xl font-black text-slate-900 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-6">
          Something went wrong with your transaction. No charges were made to your account.
        </p>

        {/* Error Details Box */}
        <div className="bg-red-50 rounded-xl p-4 mb-8 text-left border border-red-100 flex gap-3 items-start">
          <AlertTriangle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-700 text-sm">Error Details</h3>
            <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
            <span className="text-xs text-red-400 mt-2 block font-mono uppercase">Code: {errorCode}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleRetry}
            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
          >
            <RefreshCcw size={18} />
            Try Payment Again
          </button>
          
          <Link 
            to="/" 
            className="w-full bg-white text-slate-600 font-bold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Return to Home
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-xs text-gray-400">
          Having trouble? <a href="#" className="text-slate-900 underline hover:no-underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;