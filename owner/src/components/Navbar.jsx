import React from "react";

import { FiBell, FiHelpCircle } from "react-icons/fi";

const Navbar = () => {
  return (
    <nav
      className="bg-slate-900 text-white h-20 mx-auto px-4 sm:px-6 lg:px-8 flex 
        items-center justify-between shadow-lg 
       "
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg text-2xl">⚽</div>
        <h1 className="text-2xl font-bold tracking-wide">Turfy Play</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="hover:text-emerald-400 transition-colors duration-200">
          <FiBell size={24} />
        </button>

        <button className="hover:text-emerald-400 transition-colors duration-200">
          <FiHelpCircle size={24} />
        </button>

        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold border-2 border-emerald-500 cursor-pointer hover:scale-105 transition-transform">
          A
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
