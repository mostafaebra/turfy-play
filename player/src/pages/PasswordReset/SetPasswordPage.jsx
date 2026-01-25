import React from "react";
import NewPasswordForm from "../../components/NewPasswordForm"; 

export default function SetNewPasswordPage() {
  return (
    // توسيط المحتوى عموديًا وأفقيًا
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-gray px-4 font-display">
      
      {/* الشعار في الأعلى (وسط) - كما يظهر في الصورة */}
       <header className="w-full flex justify-center py-6">
        <span className="text-xl font-bold font-[sans-serif] text-[#1E293B] mb-12">
          ⚽ Turfy Play
        </span>
      </header>
      
      {/* الحاوية البيضاء للنموذج */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <NewPasswordForm />
      </div>
    </div>
  );
}