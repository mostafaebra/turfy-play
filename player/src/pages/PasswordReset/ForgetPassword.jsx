import React from "react";
import ForgetPasswordForm from "../../components/ForgetPasswordForm";  

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-light-gray font-display">
      
      {/* Header - العنوان الرئيسي أعلى الصفحة */}
      <header className="w-full flex justify-center py-6">
        <span className="text-2xl font-bold font-[sans-serif] text-[#1E293B] mb-7">
          ⚽ Turfy Play
        </span>
      </header>

      {/* المحتوى - الفورم في المنتصف */}
      <div className="flex items-center justify-center px-9">
        <div className="w-full max-w-md bg-white rounded-xl p-8 mt-10">

          <ForgetPasswordForm />
        </div>
      </div>

    </div>
  );
}