import React from "react";
import { FiSearch, FiBell } from "react-icons/fi";  

export default function AccHeader2({ searchValue, onSearchChange, onSearchSubmit, userImage }) {
  return (
    <header className="w-full bg-white border-b border-gray-100 h-20 flex items-center px-8 sticky top-0 z-50 font-display">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
        
        {/* Logo & Navigation */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[#1E293B]">⚽ Turfy Play</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold">
            <a href="/" className="text-gray-400 hover:text-[#22C55E] transition">Home</a>
            <a href="/competitions" className="text-[#22C55E]">Competitions</a>
          </nav>
        </div>

        {/* Search Bar الحقيقي المربوط بالـ API */}
        <div className="flex-1 max-w-md mx-10 relative">
          <FiSearch 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5 cursor-pointer hover:text-[#22C55E]" 
            onClick={onSearchSubmit}
          />
          <input
            type="text"
            placeholder="Search competitions..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
            className="w-full bg-[#F3F4F6] border-none rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#22C55E] transition-all outline-none"
          />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6">
          <button className="relative text-gray-600 hover:text-[#22C55E] transition">
            <FiBell size={24} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="w-10 h-10 rounded-full border-2 border-gray-100 p-0.5 cursor-pointer overflow-hidden">
            <img 
              src={userImage || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"} 
              alt="User" 
              className="w-full h-full object-cover rounded-full bg-gray-100" 
              onError={(e) => { e.target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; }}
            />
          </div>
        </div>

      </div>
    </header>
  );
}