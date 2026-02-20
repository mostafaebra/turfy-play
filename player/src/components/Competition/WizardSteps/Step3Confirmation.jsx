import React from "react";
import { CheckCircle, Trophy, Share2, Calendar, Users, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Step3Confirmation = ({ formData }) => {
  const navigate = useNavigate();

  return (
    <div className="p-8 md:p-12 text-center animate-in zoom-in duration-500">
      {/* Success Icon */}
      <div className="mb-6 relative inline-block">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <div className="absolute -top-2 -right-2">
            <Trophy size={32} className="text-yellow-500 rotate-12" />
        </div>
      </div>

      <h2 className="text-3xl font-black text-gray-900 mb-2">You're In!</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        Your team <span className="font-bold text-[#111827]">"{formData.teamName}"</span> has been successfully registered for the competition.
      </p>

      {/* Team Recap Card */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 max-w-sm mx-auto mb-10 text-left space-y-4">
        <div className="flex items-center gap-4">
            {formData.teamLogo ? (
                <img 
                    src={URL.createObjectURL(formData.teamLogo)} 
                    alt="Team Logo" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                />
            ) : (
                <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center text-white font-bold">
                    {formData.teamName.charAt(0)}
                </div>
            )}
            <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Team Captain</p>
                <p className="font-bold text-gray-800">{formData.captainName}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                <span className="text-xs font-medium text-gray-600">Status: Registered</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar size={16} className="text-green-500" />
                <span className="text-xs font-medium text-gray-600">Starts: July 20</span>
            </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <button 
          className="w-full bg-[#111827] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"
          onClick={() => alert("Registration Details Shared!")}
        >
          <Share2 size={18} /> Share with Team
        </button>
        
        <button 
          className="w-full bg-white text-gray-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 transition-all"
          onClick={() => navigate("/")}
        >
          <Home size={18} /> Back to Home
        </button>
      </div>

      <p className="text-[10px] text-gray-400 mt-10">
        A confirmation email has been sent to your registered address.
      </p>
    </div>
  );
};

export default Step3Confirmation;