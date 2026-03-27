import React from "react";
import { FiMapPin, FiNavigation } from "react-icons/fi";

export default function VenueInfo({ venue }) {
  
  
  const openGoogleMaps = () => {
    
    if (venue.latitude && venue.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`;
      window.open(url, "_blank");
    } else {
      alert("Location coordinates are not available for this venue.");
    }
  };

  return (
    <div className="bg-white rounded-[1.5rem] border border-[#EBECEF] p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="space-y-4">
        { }
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#3B82F6]/10 text-[#3B82F6] rounded-xl">
            <FiMapPin size={22} />
          </div>
          <h3 className="text-lg font-black text-[#1E293B] tracking-tight">Venue Info</h3>
        </div>
        
        { }
        <div className="space-y-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Field Name</span>
            <span className="text-sm font-black text-[#1E293B] italic">{venue.fieldName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</span>
            <span className="text-sm font-bold text-gray-500 leading-tight">{venue.address}</span>
          </div>
        </div>
      </div>

      { }
      <button 
        onClick={openGoogleMaps}
        className="w-full mt-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95"
      >
        <FiNavigation size={16} /> Get Directions
      </button>
    </div>
  );
}