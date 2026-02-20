import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Share2, Loader, Home } from "lucide-react";
import { getConfirmationDetails } from "../../services/api";

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const transactionId = searchParams.get("id");
  const isStatusSuccess = searchParams.get("success") === "true" || searchParams.get("status") === "success";

  useEffect(() => {
    const fetchData = async () => {
      if (!transactionId) {
        setLoading(false);
        return;
      }
      try {
        const response = await getConfirmationDetails(transactionId);
        

        if (response && response.data) {
          setDetails(response.data);
        } else {
          setDetails(response);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isStatusSuccess) fetchData();
    else setLoading(false);
  }, [transactionId, isStatusSuccess]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-green-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="pt-10 pb-6 px-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle size={48} className="text-[#22C55E]" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-3xl font-black text-[#111827] mb-2 tracking-tight">
            Registration Confirmed!
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Congratulations, <span className="text-[#111827] font-bold">
              {details?.teamName || "Your Team"}
            </span>!
          </p>
        </div>

        <div className="border-t border-gray-100 mx-8"></div>

        {/* Details Section */}
        <div className="p-8 space-y-6">
          <h3 className="text-lg font-bold text-[#111827]">Registration Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Competition Name</span>
              <span className="text-[#111827] font-bold text-right max-w-[60%]">
                {details?.competitionName || "Loading..."}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">OTP Code</span>
              <span className="text-[#111827] font-bold font-mono tracking-wide bg-gray-100 px-2 py-1 rounded">
                {details?.otp || transactionId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Amount Paid</span>
              <span className="bg-[#DCFCE7] text-[#166534] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                {details?.price ? `${details.price} EGP` : "Paid"}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="px-8 pb-10 space-y-3">
          <button 
            className="w-full bg-[#22C55E] hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
            onClick={() => alert(`Share Code: ${details?.otp}`)}
          >
            <Share2 size={20} /> Share With Team
          </button>

          <button 
              className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              onClick={() => navigate("/")}
          >
              <Home size={18} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;