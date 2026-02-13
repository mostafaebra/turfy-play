import React from "react";
import { Box, MapPin, Calendar, Clock } from "lucide-react";

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

  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div className="flex flex-col gap-1 font-display w-full">
      <h3 className="text-dark font-bold text-lg mb-2">
        Booking Specifics
      </h3>

      <div className="flex flex-col border-t border-gray-100">

        {/* Field Name */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Box size={20} className="text-[#3b82f6]" />
            <span className="text-gray-500 text-sm font-medium">Field Name</span>
          </div>
          <span className="text-dark font-bold text-sm">
            {fieldName}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-[#3b82f6]" />
            <span className="text-gray-500 text-sm font-medium">Location</span>
          </div>

          {hasLocation ? (
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="text-[#3b82f6] font-bold text-sm hover:underline"
            >
              Get Directions
            </a>
          ) : (
            <span className="text-gray-400 text-sm font-medium">
              Unavailable
            </span>
          )}
        </div>

        {/* Date & Time */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-[#3b82f6]" />
            <span className="text-gray-500 text-sm font-medium">Date & Time</span>
          </div>
          <span className="text-dark font-bold text-sm">
            {date} at {time}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-[#3b82f6]" />
            <span className="text-gray-500 text-sm font-medium">Duration</span>
          </div>
          <span className="text-dark font-bold text-sm">
            {duration} Minutes
          </span>
        </div>

      </div>
    </div>
  );
}
