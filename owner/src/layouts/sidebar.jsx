import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiCalendar, FiUsers, FiBarChart2, FiSettings, FiLogOut, FiX } from "react-icons/fi";

export default function Sidebar({ menuItems = [], businessName = "Turfy Play", isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <>
      { }
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 2. Sidebar Container */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-[#1E293B] text-white flex flex-col z-[70] transition-transform duration-300 ease-in-out font-display
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        
        { }
        <div className="p-6 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#22C55E] rounded-xl flex items-center justify-center font-black text-sm">T</div>
            <h2 className="font-black text-sm">{businessName}</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white ">
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto no-scrollbar ">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)} 
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
                location.pathname === item.path ? "bg-[#22C55E] text-white" : "text-gray-400 hover:bg-slate-800/50 hover:text-primary"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-4 py-3.5 text-gray-400 font-bold text-sm">
             <FiSettings size={18} /> Settings
          </Link>
          <button className="w-full flex items-center gap-4 px-4 py-3.5 text-gray-400 hover:text-red-400 font-bold text-sm rounded-xl hover:bg-red-500/5 transition-all">
           <FiLogOut size={18} /> Logout
        </button>
        </div>
      </aside>
    </>
  );
}