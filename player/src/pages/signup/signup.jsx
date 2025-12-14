import React from "react";
import SignupHeader from "../../components/SignupHeader";
import SignupForm from "../../components/SignupForm";
import SignupFooter from "../../components/SignupFooter";

export default function Signup() {
  return (
    // استخدام light-gray كلون للخلفية وتطبيق الخط العام font-display
    <div className="min-h-screen flex items-center justify-center bg-light-gray px-4 font-display">
      {/* استخدام rounded-xl للحواف الكبيرة المخصصة */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <SignupHeader />
        <SignupForm />
        <SignupFooter />
      </div>
    </div>
  );
}