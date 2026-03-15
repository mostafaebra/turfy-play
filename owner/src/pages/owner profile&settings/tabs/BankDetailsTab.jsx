import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import axios from "axios";

const BankDetailsTab = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(true);
  const [payoutData, setPayoutData] = useState({
    preferredMethod: 1, // 1 = Bank, 2 = Wallet, 3 = Instapay
    bankName: "",
    accountHolderName: "",
    iban: "",
    digitalWalletNumber: "",
    instapayAddress: ""
  });

  
  useEffect(() => {
    const fetchPayoutDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://turfytesting.runasp.net/Turfy/GetOwnerPayoutDetailsEndpoint/GetPayoutDetails", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.isSuccess && response.data.data) {
          setPayoutData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching payout details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayoutDetails();
  }, []);

  
  const validateData = () => {
    if (payoutData.preferredMethod === 1) {
      if (!payoutData.iban.startsWith("EG") || payoutData.iban.length !== 29) {
        alert("Invalid IBAN: Must start with EG and be exactly 29 characters.");
        return false;
      }
    } else if (payoutData.preferredMethod === 2) {
      const walletRegex = /^01[0125][0-9]{8}$/;
      if (!walletRegex.test(payoutData.digitalWalletNumber)) {
        alert("Invalid Wallet Number: Must be a valid 11-digit Egyptian mobile number.");
        return false;
      }
    } else if (payoutData.preferredMethod === 3) {
      if (!payoutData.instapayAddress || payoutData.instapayAddress.length > 100) {
        alert("Invalid Instapay Address (Max 100 characters).");
        return false;
      }
    }
    return true;
  };

   
  useImperativeHandle(ref, () => ({
    handleUpdatePayout: async () => {
      if (!validateData()) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
          "http://turfytesting.runasp.net/Turfy/UpdateOwnerPayoutDetailsEndpoint/UpdatePayoutDetails",
          payoutData,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json' 
            }
          }
        );

        if (response.data.isSuccess) {
          alert("Payout details updated successfully!");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Failed to update payout details.");
      }
    }
  }));

  if (loading) return <div className="h-40 flex items-center justify-center font-bold text-[#22C55E]">Loading Payout Details...</div>;

  return (
    <div className="flex flex-col gap-8 pb-20 animate-fadeIn font-display">
      
      {/* Choose Payout Method */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <FiLock className="text-[#1E293B]" size={20} />
          <h3 className="font-black text-xl text-[#1E293B]">Payout Method</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 1, name: "Bank Account" },
            { id: 2, name: "Digital Wallet" },
            { id: 3, name: "Instapay" }
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setPayoutData({...payoutData, preferredMethod: item.id})}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                payoutData.preferredMethod === item.id 
                ? "border-[#22C55E] bg-[#F0FDF4]" 
                : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payoutData.preferredMethod === item.id ? "border-[#22C55E]" : "border-gray-300"}`}>
                {payoutData.preferredMethod === item.id && <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full" />}
              </div>
              <span className={`font-bold text-sm ${payoutData.preferredMethod === item.id ? "text-[#1E293B]" : "text-gray-400"}`}>{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Form Content */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        {payoutData.preferredMethod === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-black text-lg text-[#1E293B]">Bank Account Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500">Bank Name</label>
                <input 
                  type="text" 
                  value={payoutData.bankName || ""} 
                  onChange={(e) => setPayoutData({...payoutData, bankName: e.target.value})}
                  placeholder="e.g., CIB, Banque Misr" 
                  className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500">Account Holder Name</label>
                <input 
                  type="text" 
                  value={payoutData.accountHolderName || ""} 
                  onChange={(e) => setPayoutData({...payoutData, accountHolderName: e.target.value})}
                  placeholder="Name as it appears on bank records" 
                  className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500">IBAN (29 characters)</label>
                <input 
                  type="text" 
                  value={payoutData.iban || ""} 
                  onChange={(e) => setPayoutData({...payoutData, iban: e.target.value})}
                  placeholder="EG..." 
                  className={`w-full bg-[#F9FAFB] border rounded-xl py-3 px-4 font-bold outline-none ${payoutData.iban && (payoutData.iban.length !== 29 || !payoutData.iban.startsWith("EG")) ? 'border-red-300' : 'border-gray-200'}`} 
                />
              </div>
            </div>
          </div>
        )}

        {payoutData.preferredMethod === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-black text-lg text-[#1E293B]">Digital Wallet Details</h3>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Mobile Number (Vodafone, Orange, etc.)</label>
              <input 
                type="text" 
                value={payoutData.digitalWalletNumber || ""} 
                onChange={(e) => setPayoutData({...payoutData, digitalWalletNumber: e.target.value})}
                placeholder="010XXXXXXXX" 
                className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold outline-none" 
              />
            </div>
          </div>
        )}

        {payoutData.preferredMethod === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="font-black text-lg text-[#1E293B]">Instapay Details</h3>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Instapay Address (IPA)</label>
              <input 
                type="text" 
                value={payoutData.instapayAddress || ""} 
                onChange={(e) => setPayoutData({...payoutData, instapayAddress: e.target.value})}
                placeholder="username@instapay" 
                className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold outline-none" 
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
});

export default BankDetailsTab;