import React from "react";

export default function EntryCode({ code }) {
  // هندلة الحالة لو الكود مش موجود أو قيمته null
  const hasCode = code && code !== "string" && code !== "";

  return (
    <div className="bg-white border border-[#F1F2F4] rounded-[1.5rem] p-8 text-center shadow-sm">
      {/* العنوان الصغير بنفس ستايل الصورة */}
      <h4 className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-3">
        Entry Code
      </h4>

      {hasCode ? (
        <div className="space-y-4 animate-fadeIn">
          {/* عرض الكود بشكل نصي واسع (ستايل الصورة الجديد) */}
          <p className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-[0.3em] md:tracking-[0.4em] font-mono ml-[0.4em]">
            {code}
          </p>
          
          {/* رسالة توضيحية بسيطة للقديم */}
          <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider opacity-80">
            Show this at the venue
          </p>
        </div>
      ) : (
        /* الحالة لو الكود منتهي (Expired) زي ما في الصورة بالظبط */
        <div className="py-2 animate-pulse">
          <p className="text-sm md:text-base font-bold text-gray-300 italic">
            This code has expired.
          </p>
        </div>
      )}
    </div>
  );
}