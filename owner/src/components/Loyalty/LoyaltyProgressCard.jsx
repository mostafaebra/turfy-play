import React from "react";
import { FiShare2, FiAward } from "react-icons/fi";

export default function LoyaltyProgressCard({ data }) {
  
  const current = data?.currentBookings || 0;
  const target = data?.targetBookings || 0;
  const remaining = data?.remainingBookings || 0;
  const reward = data?.rewardPreview || "Monthly Reward";

  // حساب النسبة المئوية للـ Progress Bar بدقة
  const percentage = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden mb-8 animate-fadeIn">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl md:text-3xl font-black text-[#1E293B] leading-tight max-w-md">
            You are just <span className="text-[#22C55E]">{remaining} bookings</span> away from your monthly reward!
          </h2>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">
            Complete {target} bookings this month to unlock your reward.
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-end font-black">
              <span className="text-sm text-[#1E293B]">Monthly Progress</span>
              <span className="text-[#22C55E]">{current} / {target}</span>
            </div>
            {/* Progress Bar  */}
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#FACC15] to-[#22C55E] transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <button className="bg-[#FACC15] text-[#1E293B] px-8 py-4 rounded-2xl font-black shadow-lg shadow-yellow-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 w-full sm:w-auto justify-center">
            <FiShare2 /> Share Your Booking Link
          </button>
        </div>

        {/* Reward Preview Card  */}
        <div className="lg:w-72 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 transition-transform hover:rotate-1">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md text-[#FACC15]">
            <FiAward size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Reward Preview</p>
            <h4 className="font-black text-[#1E293B] leading-snug text-lg">{reward}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}