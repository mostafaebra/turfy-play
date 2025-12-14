import React from "react";
import Header from "../../components/Header";
import LoginForm from "../../components/LoginForm";
import LoginFooter from "../../components/loginFooter";


export default function Login() {
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-light-gray px-4 font-display">
      {/* استخدام rounded-xl للحواف الكبيرة المخصصة */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <Header />
        <LoginForm />
        <LoginFooter />
      </div>
    </div>
  );
}
