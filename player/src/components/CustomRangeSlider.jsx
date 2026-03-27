import React from "react";

export default function CustomRangeSlider({ label, value, onChange }) {
  
  const getRatingLabel = (val) => {
    if (val < 20) return "Poor";
    if (val < 40) return "Below Average";
    if (val < 60) return "Average";
    if (val < 80) return "Good";
    return "Excellent";
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center gap-3">
        <label className="text-sm text-dark  font-bold tracking-widest">{label}</label>
         { }
        <span className="text-xs md:text-sm font-black italic text-[#22C55E]/70 whitespace-nowrap">
          ({value}) {getRatingLabel(value)}
        </span>
      </div>
      
       {  }
      <input 
        type="range" 
        min="0" 
        max="100" 
        step="10" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="custom-range-slider w-full h-1.5 bg-[#F8F9FB] rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}