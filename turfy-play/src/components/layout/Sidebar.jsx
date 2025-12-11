import React from 'react';
import { useNavigate } from 'react-router-dom'; // Added for logout navigation
import { LayoutDashboard, FileText, CircleDashed, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // 1. Remove data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // 2. Redirect to login page
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      {/* User Profile Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            alt="User" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Alex Johnson</h3>
          <p className="text-xs text-green-500">Turfy Play Ops</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem icon={<FileText size={20} />} label="Submissions" active />
        <NavItem icon={<CircleDashed size={20} />} label="Fields" />
        <NavItem icon={<Users size={20} />} label="Users" />
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout} // Attached the logout function here
          className="flex items-center gap-3 text-gray-400 hover:text-red-500 w-full px-4 py-3 transition-colors text-sm font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

// Helper Component for Menu Items
const NavItem = ({ icon, label, active }) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium
      ${active 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;