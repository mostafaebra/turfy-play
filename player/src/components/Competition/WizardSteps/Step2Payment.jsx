import React, { useState } from "react";
import { CreditCard, Wallet, Banknote, CheckCircle, AlertCircle } from "lucide-react";

const Step2Payment = ({ formData, updateFormData, onNext, onBack }) => {
  // ثوابت (ممكن تيجي من الـ API بعدين)
  const ENTRY_FEE = 1000;
  const SERVICE_FEE = 50;
  const USER_WALLET_BALANCE = 250.00; // رصيد وهمي للمحاكاة

  // State محلي للموافقة على الشروط
  const [agreed, setAgreed] = useState(false);

  // --- 🧮 Logic الحسابات ---
  const subtotal = ENTRY_FEE + SERVICE_FEE;
  
  // لو معلم على المحفظة، نخصم الرصيد (بحد أقصى قيمة الفاتورة)
  const walletDiscount = formData.useWallet 
    ? Math.min(subtotal, USER_WALLET_BALANCE) 
    : 0;

  const totalDue = subtotal - walletDiscount;

  return (
    <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Step 2: Payment Summary & Checkout</h2>

      {/* --- 1. Order Summary --- */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6 space-y-3">
        <h3 className="font-bold text-gray-700 text-sm mb-2">Order Summary</h3>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Competition Entry Fee</span>
          <span className="font-medium">{ENTRY_FEE.toFixed(2)} EGP</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Service Fee (5%)</span>
          <span className="font-medium">{SERVICE_FEE.toFixed(2)} EGP</span>
        </div>

        <div className="h-px bg-gray-300 my-2"></div>

        <div className="flex justify-between text-base font-bold text-gray-800">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} EGP</span>
        </div>
      </div>

      {/* --- 2. Wallet Credit Logic --- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700 text-sm">Wallet Credit</h3>
            <span className="text-xs text-blue-600 font-medium">Balance: {USER_WALLET_BALANCE.toFixed(2)} EGP</span>
        </div>
        
        <label 
            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all
            ${formData.useWallet ? "border-green-500 bg-green-50 ring-1 ring-green-500" : "border-gray-200 hover:bg-gray-50"}
            `}
        >
            <input 
                type="checkbox" 
                className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mr-3 accent-green-600"
                checked={formData.useWallet}
                onChange={(e) => updateFormData("useWallet", e.target.checked)}
            />
            <div className="flex-1">
                <span className="font-semibold text-gray-800">Use Turfy Play Wallet Credit</span>
                {formData.useWallet && (
                    <p className="text-xs text-green-700 mt-1">
                        Applied: -{walletDiscount.toFixed(2)} EGP
                    </p>
                )}
            </div>
            <Wallet className={formData.useWallet ? "text-green-600" : "text-gray-400"} />
        </label>
      </div>

      {/* --- 3. Total Amount Due (النتيجة النهائية) --- */}
      <div className="bg-green-50 p-5 rounded-xl border border-green-200 mb-8 flex justify-between items-center">
        <div>
            <p className="text-sm text-green-800 font-medium">Total Amount Due</p>
            {walletDiscount > 0 && <p className="text-xs text-green-600">Wallet discount applied</p>}
        </div>
        <p className="text-2xl font-bold text-green-700">{totalDue.toFixed(2)} EGP</p>
      </div>

      {/* --- 4. Payment Method --- */}
      <div className="mb-8 space-y-3">
        <h3 className="font-bold text-gray-700 text-sm mb-2">Choose Your Payment Method</h3>
        
        {/* Option A: Credit Card */}
        <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'credit_card' ? 'border-green-500 bg-white ring-2 ring-green-500 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === 'credit_card' ? 'border-green-500' : 'border-gray-300'}`}>
                    {formData.paymentMethod === 'credit_card' && <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>}
                </div>
                <span className="font-medium text-gray-700">Credit / Debit Card</span>
            </div>
            <CreditCard className="text-gray-400" size={20} />
            <input type="radio" name="payment" value="credit_card" className="hidden" checked={formData.paymentMethod === 'credit_card'} onChange={() => updateFormData("paymentMethod", "credit_card")} />
        </label>

        {/* Option B: Fawry / Other */}
        <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'fawry' ? 'border-green-500 bg-white ring-2 ring-green-500 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === 'fawry' ? 'border-green-500' : 'border-gray-300'}`}>
                    {formData.paymentMethod === 'fawry' && <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>}
                </div>
                <span className="font-medium text-gray-700">Fawry / Other Local Options</span>
            </div>
            <Banknote className="text-gray-400" size={20} />
            <input type="radio" name="payment" value="fawry" className="hidden" checked={formData.paymentMethod === 'fawry'} onChange={() => updateFormData("paymentMethod", "fawry")} />
        </label>
      </div>

      {/* --- 5. Terms & Actions --- */}
      <div className="space-y-6">
        <label className="flex items-start gap-3 cursor-pointer group">
            <div className={`mt-0.5 w-5 h-5 border rounded flex items-center justify-center transition-colors ${agreed ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white group-hover:border-green-400'}`}>
                {agreed && <CheckCircle size={14} className="text-white" />}
            </div>
            <input type="checkbox" className="hidden" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span className="text-sm text-gray-500 select-none">
                I confirm my team agrees to the <span className="text-blue-600 underline hover:text-blue-800">Competition Rules</span> and Turfy Play's <span className="text-blue-600 underline hover:text-blue-800">Payment Policy</span>.
            </span>
        </label>

        <div className="flex gap-4 pt-2">
            <button 
                onClick={onBack} 
                className="flex-1 px-6 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
                Back
            </button>
            <button 
                onClick={onNext} 
                disabled={!agreed}
                className={`flex-1 px-6 py-3.5 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2
                    ${agreed ? "bg-green-600 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5" : "bg-gray-300 cursor-not-allowed"}
                `}
            >
                Pay Now & Register Team
            </button>
        </div>
      </div>

    </div>
  );
};

export default Step2Payment;