import React from "react";
import { FiInfo } from "react-icons/fi";

export default function ImportantNotes({ rules }) {
  return (
    <div className="bg-white rounded-[1.5rem] border border-[#EBECEF] p-6 md:p-8 shadow-sm space-y-5 animate-fadeIn">
      { }
      <div className="flex items-center gap-3 text-[#3B82F6]">
        <div className="p-2 bg-blue-50 rounded-xl">
          <FiInfo size={24} />
        </div>
        <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
          Important Notes / Rules
        </h3>
      </div>

      { }
      <div className="space-y-4">
        <p className="text-sm md:text-base font-bold text-gray-500 leading-relaxed italic border-l-4 border-blue-100 pl-4 py-2">
          {rules || "No specific rules provided for this competition."}
        </p>
        
        { }
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 p-3 rounded-lg text-center">
          ⚠️ Please arrive at least 30 minutes before the kick-off time.
        </p>
      </div>
    </div>
  );
}