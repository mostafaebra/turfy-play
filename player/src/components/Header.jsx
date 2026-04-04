import React from "react";

export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center mb-8 font-display">
      {/* الشعار */}
      <div className="flex items-center gap-2 mb-4">
        {/* نستخدم لون الشعار الأساسي وهو primary (الـ #10B981) */}
        <span className="text-2xl font-extrabold text-[#1E293B]"> ⚽ Turfy Play</span>
      </div>
      
      {/* نص تسجيل الدخول */}
      {/* نستخدم text-light للنصوص الفرعية */}
      <h1 className="text-lg font-normal text-text-light">
        Sign in to your account
      </h1>
    </div>
  );
}