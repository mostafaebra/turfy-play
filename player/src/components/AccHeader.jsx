import React from "react";
import { Link, useNavigate } from "react-router-dom";

 
export default function AccHeader({ userImage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");  
    
    
    navigate("/login");
    console.log("User logged out successfully");
  };

  return (
    <header className="w-full bg-white border-b h-20 flex items-center px-7 sticky top-0 z-50 font-display">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div   />
          <span className="text-xl font-bold text-gray-800 tracking-tight"> ⚽ Turfy Play</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
          <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
          <Link to="/bookings" className="text-gray-600 hover:text-primary transition-colors">Bookings</Link>
          <Link to="/venues" className="text-gray-600 hover:text-primary transition-colors">Venues</Link>
          <Link to="/community" className="text-gray-600 hover:text-primary transition-colors">Community</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">
          {/* تفعيل زر تسجيل الخروج */}
          <button 
            onClick={handleLogout}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition shadow-sm"
          >
            Log Out
          </button>

          {/* صورة المستخدم الحقيقية */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
            <img
              src={userImage || "https://via.placeholder.com/100"}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </header>
  );
}