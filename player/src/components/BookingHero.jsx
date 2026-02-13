import React from "react";

 
export default function BookingHero({ imageUrl, status }) {
  
  
 const getStatusDetails = (statusValue) => {
  const value = String(statusValue);  

  const statusMap = {
    "Pending": { text: "Pending", bgColor: "bg-yellow-500" },
    "Cancelled": { text: "Cancelled", bgColor: "bg-red-500" },
    "Confirmed": { text: "Confirmed", bgColor: "bg-primary" },
    "Completed": { text: "Completed", bgColor: "bg-blue-500" },
    "Refunded": { text: "Refunded", bgColor: "bg-purple-500" },
    "Rejected": { text: "Rejected", bgColor: "bg-gray-500" },
  };

  return statusMap[value] || { text: "Unknown", bgColor: "bg-gray-400" };
};



 console.log(typeof status, status);


  const statusInfo = getStatusDetails(status);

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-md">
      { }
      <img 
        src={imageUrl && imageUrl !== "string" ? imageUrl : "/default-field.jpg"}
        alt="Sports Field" 
        className="w-full h-full object-cover"
      />
      
      { }
      <div className={`absolute bottom-4 left-4 ${statusInfo.bgColor} text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg`}>
        {statusInfo.text}
      </div>
    </div>
  );
}