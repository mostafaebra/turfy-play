import React from "react";
import { FiBox, FiMapPin, FiCalendar, FiClock } from "react-icons/fi"; // وحدنا المكتبة لـ react-icons

export default function BookingSpecifics({
  fieldName,
  date,
  time,
  duration,
  latitude,
  longitude
}) {

  const hasLocation =
    latitude !== 0 &&
    longitude !== 0 &&
    latitude !== undefined &&
    longitude !== undefined;

  // تصحيح الرابط (شيلنا الـ 0 والـ googleusercontent الزيادة)
  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div className="flex flex-col gap-4 font-sans w-full">
      {/* العنوان بستايل المودرن */}
      <h3 className="text-lg font-black text-[#1E293B] border-b border-[#F1F2F4] pb-3 tracking-tight">
        Booking Specifics
      </h3>

      <div className="bg-white rounded-2xl p-6 border border-[#F1F2F4] flex flex-col gap-4 shadow-sm">
        
        {/* Field Name */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FiBox size={16} className="text-gray-400" />
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Field Name</span>
          </div>
          <span className="text-[#1E293B] font-black italic">
            {fieldName}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FiCalendar size={16} className="text-gray-400" />
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Date & Time</span>
          </div>
          <span className="text-[#1E293B] font-black italic">
            {date} at {time}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FiClock size={16} className="text-gray-400" />
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Duration</span>
          </div>
          <span className="text-[#1E293B] font-black italic">
            {duration} Minutes
          </span>
        </div>

        {/* Location - بيظهر بس لو الحالة Confirmed (رقم 4) في الصفحة الرئيسية */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-50 mt-2">
          <div className="flex items-center gap-2">
            <FiMapPin size={16} className="text-gray-400" />
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Pitch Location</span>
          </div>

          {hasLocation ? (
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="text-[#22C55E] font-black text-xs hover:underline flex items-center gap-1"
            >
              Open in Maps
            </a>
          ) : (
            <span className="text-gray-300 font-bold italic text-xs">
              Not Set
            </span>
          )}
        </div>
      </div>
    </div>
  );
}