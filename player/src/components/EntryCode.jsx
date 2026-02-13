import React from "react";

 
export default function EntryCode({ code }) {
  
  const displayCode = code ? code.toString().split("") : ["-", "-", "-", "-", "-", "-"];

  return (
    <div className="bg-light-gray/50 border border-border-color rounded-xl p-8 text-center font-display">
      <h3 className="text-dark font-bold text-lg mb-2">Entry Code</h3>
      <p className="text-[#64748B] text-sm mb-6 font-medium">Show this code at the venue to enter</p>
      
      <div className="flex justify-center gap-3">
        {displayCode.map((num, index) => (
          <div 
            key={index} 
            className="w-12 h-16 bg-white border border-border-color rounded-lg flex items-center justify-center text-2xl font-bold text-text-dark shadow-sm"
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
}