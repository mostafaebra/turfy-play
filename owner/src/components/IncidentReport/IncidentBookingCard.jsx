import React from "react";

export default function IncidentBookingCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:row items-center justify-between gap-6 mb-8 font-display">
      <div className="flex items-center gap-4">
        <img 
          src={data.accused?.imageURL || "https://ui-avatars.com/api/?name=User"} 
          alt={data.accused?.userName} 
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-50 shadow-sm"
        />
        <div>
          <h4 className="font-black text-[#1E293B] text-lg">{data.accused?.userName || "Loading..."}</h4>
          <p className="text-sm text-gray-400 font-medium">{data.accused?.phone}</p>
        </div>
      </div>

      <div className="text-center md:text-right">
        <p className="text-sm font-bold text-[#1E293B]">Booking Ref: #BK{data.bookingId}</p>
        <p className="text-xs text-gray-400 font-medium mt-1">{data.date}, {data.time}</p>
        <p className="text-xs text-[#22C55E] font-bold mt-1 italic">{data.fieldName}</p>
      </div>

      <div className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
        Verified / Ended
      </div>
    </div>
  );
}