import React from "react";
import { FiCheck } from "react-icons/fi";  

export default function SuccessMessage() {
  return (
    <div className="font-display text-center flex flex-col items-center">
      
      {/* أيقونة النجاح الدائرية */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
        {/* الأيقونة الداخلية - بلون primary */}
        <FiCheck size={32} className="text-primary" />
      </div>
      
      {/* العنوان الرئيسي */}
      <h1 className="text-2xl font-bold font-[sans-serif] text-dark mb-4">
        Password Reset Successful!
      </h1>
      
      {/* الرسالة التوضيحية */}
      <p className="text-sm font-normal text-text-light max-w-xs mx-auto mb-8">
        Your password has been successfully updated. You can now log in with your new password.
      </p>

      {/* Proceed to Login Button */}
      <button
        type="button"
       
        className="w-full h-12 rounded bg-primary text-white text-base font-semibold hover:bg-primary/90 transition" 
      >
        Proceed to Login
      </button>

    </div>
  );
}