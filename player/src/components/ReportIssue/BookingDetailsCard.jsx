import React from "react";

const BookingDetailsCard = ({ bookingData }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex justify-between">
        Booking Context
      </h3>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center border-b border-gray-100 p-4">
          <span className="text-blue-500 font-medium w-32 text-sm">Field Name</span>
          <span className="text-gray-900 font-medium mt-1 md:mt-0">
            {bookingData?.fieldName || "N/A"}
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center border-b border-gray-100 p-4">
          <span className="text-blue-500 font-medium w-32 text-sm">Date</span>
          <span className="text-gray-900 font-medium mt-1 md:mt-0">
            {bookingData?.date || "N/A"}
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center p-4 border-b border-gray-100">
          <span className="text-blue-500 font-medium w-32 text-sm">Time</span>
          <span className="text-gray-900 font-medium mt-1 md:mt-0">
            {bookingData?.time || "N/A"}
          </span>
        </div>
        
        {/* Accused Info Section */}
        {bookingData?.accused && (
          <div className="flex flex-col md:flex-row md:items-center p-4 bg-red-50/30">
            <span className="text-red-500 font-medium w-32 text-sm">Reporting</span>
            <div className="flex items-center gap-3 mt-2 md:mt-0">
              {bookingData.accused.imageURL ? (
                <img 
                  src={bookingData.accused.imageURL} 
                  alt="Accused profile" 
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {bookingData.accused.userName?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <p className="text-gray-900 font-bold">{bookingData.accused.userName}</p>
                <p className="text-xs text-gray-500">{bookingData.accused.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsCard;