import React from "react";

export default function BookingHero({ imageUrl, status }) {
  
  // دالة تحويل الأرقام لحالات مفهومة بناءً على كلام الباك-إند
  const getStatusDetails = (statusValue) => {
    // الخريطة الجديدة بناءً على الأرقام
    const statusMap = {
      "4": { text: "Confirmed", bgColor: "bg-[#22C55E]" }, // الأخضر الرسمي
      "1": { text: "Pending", bgColor: "bg-amber-500" },   // البرتقالي
      "0": { text: "Cancelled", bgColor: "bg-red-500" },   // الأحمر
      "Ended": { text: "Ended", bgColor: "bg-[#475569]" }, // الرمادي الغامق زي الصورة
    };

    // لو الحالة مش موجودة بنعتبرها "Ended" كشكل افتراضي للحجوزات القديمة
    return statusMap[String(statusValue)] || statusMap["Ended"];
  };

  const statusInfo = getStatusDetails(status);

  return (
    <div className="relative w-full h-64 md:h-80 rounded-[1.5rem] overflow-hidden shadow-sm group">
      {/* 🖼️ الصورة مع الـ Fallback */}
      <img 
        src={imageUrl && imageUrl !== "string" ? imageUrl : "https://via.placeholder.com/800x400?text=Field+Image"}
        alt="Field" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* 🌑 الـ Gradient الداكن اللي تحت عشان يظهر الكلام (زي الصورة) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
      
      {/* 🏷️ الـ Status Badge (مطابق للصورة تماماً) */}
      <div className={`absolute bottom-6 left-6 ${statusInfo.bgColor} text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg border border-white/10`}>
        {statusInfo.text}
      </div>
    </div>
  );
}