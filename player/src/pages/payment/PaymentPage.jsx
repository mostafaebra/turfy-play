import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingApi } from '../../services/bookingApi';
// --- FIX: Import missing icons ---
import { CreditCard, Wallet, ArrowRight, AlertCircle, Loader2, Lock, Smartphone, Receipt } from 'lucide-react';

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Retrieve data passed from BookingPage
  const bookingDetails = state?.bookingDetails;

  const [paymentMethod, setPaymentMethod] = useState(1); 
  const [useWalletCredit, setUseWalletCredit] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock Wallet Balance
  const walletBalance = 450.00; 

  // Redirect if no data
  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-slate-700 font-bold mb-4">No booking details found.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-slate-900 text-white rounded-lg">Go Home</button>
      </div>
    );
  }

  // --- Calculations ---
  const basePrice = bookingDetails.basePrice || 0; 
  const serviceFee = bookingDetails.serviceFee || 0;
  const subtotal = basePrice + serviceFee;
  const creditApplied = useWalletCredit ? Math.min(walletBalance, subtotal) : 0;
  const totalAmountDue = Math.max(0, subtotal - creditApplied);

  const handleConfirmPayment = async () => {
    if (!termsAccepted) {
        setError("Please agree to the Terms and Conditions.");
        return;
    }
    
    setLoading(true);
    setError(null);

    // Phase 1: Send booking details (The backend calculates the price)
    const payload = {
      fieldId: bookingDetails.fieldId,
      bookingDate: bookingDetails.bookingDate,
      bookingTime: bookingDetails.bookingTime,
      bookingDuration: bookingDetails.bookingDuration,
      paymentMethod: paymentMethod
    };

    try {
      const response = await bookingApi.bookField(payload);

      if (response.isSuccess && response.data) {
        if (response.data.redirectUrl) {
          // Phase 2: Redirect to Gateway
          window.location.href = response.data.redirectUrl;
        } else {
          // Instant success
          navigate('/payment/success', { state: { result: response.data } });
        }
      } else {
        setError(response.message || "Booking failed initialization.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-sans text-[#333333] flex justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Payment Details</h1>

        <div className="flex flex-col gap-6 rounded-xl border border-[#E0E0E0] bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
          
          {/* Wallet Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Wallet Credit</h2>
              <div className="flex items-center gap-2 text-[#3498DB]">
                <Wallet size={24} />
                <p className="font-semibold text-base">Balance: {walletBalance.toFixed(2)} EGP</p>
              </div>
            </div>
            <label className="flex cursor-pointer items-center justify-between rounded-lg bg-[#F7F9FC] p-4 border hover:border-gray-300 transition-colors">
              <span className="font-medium">Apply available credit</span>
              <input type="checkbox" checked={useWalletCredit} onChange={(e) => setUseWalletCredit(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-[#2ECC71] focus:ring-[#2ECC71]" />
            </label>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Select Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: 1, name: 'Credit / Debit Card', Icon: CreditCard },
                { id: 2, name: 'Digital Wallets', Icon: Smartphone },
                { id: 3, name: 'Fawry', Icon: Receipt }
              ].map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all ${paymentMethod === m.id ? 'border-[#2ECC71] bg-[#2ECC71]/5' : 'border-[#E0E0E0] hover:border-gray-300'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment_method" checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} className="h-5 w-5 text-[#2ECC71] focus:ring-[#2ECC71]" />
                    <span className="font-semibold">{m.name}</span>
                  </div>
                  <m.Icon size={24} className="opacity-70"/>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-4 border-t border-[#E0E0E0] pt-6">
            <h2 className="text-xl font-semibold">Payment Summary</h2>
            <div className="space-y-2 rounded-lg bg-[#F7F9FC] p-4">
              <div className="flex justify-between text-sm"><span>Base Price</span><span className="font-medium">{basePrice.toFixed(2)} EGP</span></div>
              <div className="flex justify-between text-sm"><span>Service Fee</span><span className="font-medium">{serviceFee.toFixed(2)} EGP</span></div>
              <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-medium">{subtotal.toFixed(2)} EGP</span></div>
              {creditApplied > 0 && <div className="flex justify-between text-sm text-[#2ECC71]"><span className="font-bold">Wallet Applied</span><span>-{creditApplied.toFixed(2)} EGP</span></div>}
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#F7F9FC] p-4">
              <span className="text-lg font-bold">Total Due</span>
              <span className="text-2xl font-black">{totalAmountDue.toFixed(2)} EGP</span>
            </div>
          </div>

          {/* Footer & Actions */}
          <div className="flex flex-col gap-4 border-t border-[#E0E0E0] pt-6">
            <div className="flex items-start gap-3">
              <input id="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 h-5 w-5 rounded border-gray-300 text-[#2ECC71] focus:ring-[#2ECC71]" />
              <label htmlFor="terms" className="text-sm text-gray-600">I agree to the <span className="text-[#3498DB] underline cursor-pointer">Terms</span> and <span className="text-[#3498DB] underline cursor-pointer">Cancellation Policy</span>.</label>
            </div>
            
            {error && (
               <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                 <AlertCircle size={16}/> {error}
               </div>
            )}

            <button onClick={handleConfirmPayment} disabled={loading} className="w-full rounded-lg bg-[#2ECC71] py-4 text-lg font-bold text-white hover:bg-[#27ae60] transition-all flex justify-center items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : 'Proceed to Payment'}
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500"><Lock size={14} /> SSL Secure Payment</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;