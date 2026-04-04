import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getConfirmationDetails } from "../../services/api";
import { CheckCircle, XCircle, Home } from "lucide-react";

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract URL parameters
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  const reason = searchParams.get("reason");

  // State
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Check if the URL indicates a payment failure
  const isFailed = status === "failed";

  useEffect(() => {
    const fetchDetails = async () => {
      // If it's already failed from the payment gateway, don't call the API
      if (isFailed) {
        setLoading(false);
        return;
      }

      if (!id) {
        setLoading(false);
        setApiError("No booking ID found in the URL.");
        return;
      }

      try {
        const response = await getConfirmationDetails(id);
        if (response.isSuccess) {
          setBookingData(response.data);
        } else {
          setApiError(response.message || "Could not retrieve booking details.");
        }
      } catch (err) {
        setApiError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isFailed]);

  // ------------------------------------
  // 1. Loading State
  // ------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Processing your request...</p>
      </div>
    );
  }

  // ------------------------------------
  // 2. Failed or Error State (Red Screen)
  // ------------------------------------
  if (isFailed || apiError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Failed!</h2>
          <p className="text-gray-600 mb-6 font-medium">
            {/* Show the reason from the URL, or the API error, or a default message */}
            {reason || apiError || "Something went wrong during the booking process."}
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate(-1)} 
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate("/")} 
              className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------
  // 3. Success State (Green Screen)
  // ------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Confirmed!</h2>
        <p className="text-gray-600 mb-8">
          Congratulations, <span className="font-bold text-gray-800">{bookingData?.teamName || "Your Team"}</span>!
        </p>

        <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Registration Summary</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Competition Name</span>
              <span className="font-semibold text-gray-800">{bookingData?.competitionName || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">OTP Code</span>
              <span className="font-bold text-[#111827] bg-gray-200 px-2 py-0.5 rounded">
                {bookingData?.otpCode || id}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-gray-500">Amount Paid</span>
              <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                {bookingData?.paidAmount ? `${bookingData.paidAmount} EGP` : "Paid"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
            <button className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
              Share With Team
            </button>
            <button 
              onClick={() => navigate("/")} 
              className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Return to Home
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;