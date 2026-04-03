import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, CircleDollarSign, Map, LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#1A2235] h-screen text-white flex flex-col shrink-0">
      <div className="p-6 mb-4">
        <h1 className="text-2xl font-bold text-green-500">Turfy play</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {/* Dashboard */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-green-500 text-white shadow-md' : 'text-gray-400 hover:bg-[#252D40] hover:text-white'}`
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        {/* My Fields */}
        <NavLink 
          to="/my-fields" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-green-500 text-white' : 'text-gray-400 hover:bg-[#252D40] hover:text-white'}`
          }
        >
          <Map size={20} />
          <span>My Fields</span>
        </NavLink>

        {/* Financials */}
        <NavLink 
          to="/financials" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-green-500 text-white' : 'text-gray-400 hover:bg-[#252D40] hover:text-white'}`
          }
        >
          <CircleDollarSign size={20} />
          <span>Financials</span>
        </NavLink>

        {/* Schedule */}
        <NavLink 
          to="/schedule" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-green-500 text-white' : 'text-gray-400 hover:bg-[#252D40] hover:text-white'}`
          }
        >
          <Calendar size={20} />
          <span>Schedule</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;