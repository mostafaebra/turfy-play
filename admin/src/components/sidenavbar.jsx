import React from 'react';
import { 
  LayoutDashboard, Users, MapPin, 
  DollarSign, Gavel, BarChart3, 
  Trophy, Settings, User 
} from 'lucide-react'; // Assuming lucide-react for icons, or we can use Material Symbols

const AdminSidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: Users, label: 'Users', active: false },
    { icon: MapPin, label: 'Venues', active: false },
    { icon: DollarSign, label: 'Finances', active: false },
    { icon: Gavel, label: 'Disputes', active: false },
    { icon: BarChart3, label: 'Reports & Analytics', active: false },
    { icon: Trophy, label: 'Competitions', active: true }, // Highlighted
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside className="w-72 bg-slate-900 h-screen flex flex-col shrink-0 text-white transition-all duration-300 overflow-y-auto">
      <div className="p-4 sm:p-6">
        {/* Logo Area */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-lg sm:text-xl">
            ⚽
          </div>
          <div>
            <h1 className="text-white text-base sm:text-lg font-bold leading-tight">Turfy Play</h1>
            <p className="text-slate-400 text-xs font-medium hidden sm:block">Admin Console</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 sm:gap-2">
          {menuItems.map((item) => (
            <a 
              key={item.label}
              href="#" 
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors group ${
                item.active 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} className={`sm:w-5 sm:h-5 ${item.active ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'}`} />
              <span className="font-medium text-xs sm:text-sm">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Admin Profile Footer */}
      <div className="mt-auto p-4 sm:p-6 border-t border-slate-700/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-600 bg-cover bg-center" style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=12')" }}></div>
          <div className="flex flex-col">
            <p className="text-white text-xs sm:text-sm font-medium">Jane Doe</p>
            <p className="text-slate-400 text-xs hidden sm:block">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;