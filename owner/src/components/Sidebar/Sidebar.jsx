import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut 
} from "lucide-react";

const Sidebar = () => {
  // Main Navigation Items
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Schedule", icon: <Calendar size={20} />, path: "/schedule" },
    { name: "Bookings", icon: <CalendarDays size={20} />, path: "/bookings" },
    { name: "Customers", icon: <Users size={20} />, path: "/customers" },
    { name: "Reports", icon: <BarChart3 size={20} />, path: "/reports" },
  ];

  // Footer Navigation Items
  const bottomItems = [
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { name: "Support", icon: <HelpCircle size={20} />, path: "/support" },
  ];

  return (
    // 'overflow-y-auto' added to ensure content is scrollable on small height screens
    <div className="h-screen w-64 bg-[#0F172A] text-gray-300 flex flex-col justify-between border-r border-gray-800 flex-shrink-0 overflow-y-auto">
      
      {/* 1. Top Section: Logo & Main Menu */}
      <div className="p-6">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
            T
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-wide">Turfy Play</h1>
            <p className="text-xs text-gray-500">Field Owner</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-[#1E293B] text-green-500 border-l-4 border-green-500" 
                    : "hover:bg-[#1E293B] hover:text-white"
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 2. Bottom Section: Settings & Logout */}
      <div className="p-6 border-t border-gray-800 space-y-2">
        {bottomItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#1E293B] hover:text-white transition-colors"
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
        
        <button className="w-full flex items-center gap-3 px-4 py-2 mt-4 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;