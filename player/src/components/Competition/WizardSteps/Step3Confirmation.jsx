import React from "react";
import { Check, Share2, Trophy, Calendar, Copy } from "lucide-react";

const Step3Confirmation = ({ formData }) => {
  // رقم حجز وهمي (OTP)
  const otpCode = "TRFY-" + Math.floor(100000 + Math.random() * 900000) + "-A4B7";

  return (
    <div className="p-6 md:p-8 text-center animate-in fade-in zoom-in duration-500">
      
      {/* --- Success Icon --- */}
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-green-50 animate-bounce">
        <Check size={48} strokeWidth={4} />
      </div>

      {/* --- Heading --- */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Confirmed!</h2>
      <p className="text-gray-500 mb-8 text-lg">
        Congratulations, Team <span className="font-bold text-gray-800">{formData.teamName || "Champions"}</span>!
      </p>

      {/* --- Registration Summary Card --- */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-left max-w-lg mx-auto mb-8 shadow-sm">
        <h3 className="font-bold text-gray-800 border-b pb-3 mb-4">Registration Summary</h3>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Competition Name</span>
                <span className="font-semibold text-gray-900 text-right">Summer Kickoff Cup</span>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">OTP Code</span>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-gray-200 font-mono text-gray-800 font-bold">
                    {otpCode}
                    <Copy size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Payment Status</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Successful - Paid
                </span>
            </div>
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div className="max-w-md mx-auto space-y-3">
        {/* Share Button (Green Big) */}
        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
            <Share2 size={20} />
            Share Competition To Your Friends
        </button>

        <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="bg-[#111827] hover:bg-black text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                <Trophy size={18} />
                View Details
            </button>
            <button className="bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                <Calendar size={18} />
                My Competitions
            </button>
        </div>
      </div>

    </div>
  );
};

export default Step3Confirmation;