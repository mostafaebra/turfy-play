import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, MapPin, 
  DollarSign, Gavel, BarChart3, 
  Trophy, Settings, Tag, HelpCircle, X
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }, 
    { icon: Users, label: 'Users', path: '/users' },
    { icon: MapPin, label: 'Venues', path: '/venues' },
    { icon: Tag, label: 'Offers & Vouchers', path: '/voucher' }, 
    { icon: DollarSign, label: 'Finances', path: '/finances' },
    { icon: Gavel, label: 'Disputes', path: '/disputes' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Trophy, label: 'Competitions', path: '/' }, 
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    // CHANGE 1: w-72 -> w-full (Fills parent)
    // CHANGE 2: h-screen -> h-full (Fits parent height)
    <aside className="w-full h-full bg-slate-900 flex flex-col shrink-0 text-white overflow-y-auto border-r border-slate-800 custom-scrollbar">
      <div className="p-4 sm:p-6 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        )}

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-xl shrink-0">
            ⚽
          </div>
          <div>
            <h1 className="text-white text-lg font-bold leading-tight">Turfy Play</h1>
            <p className="text-slate-400 text-xs font-medium">Admin Console</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon || HelpCircle; 

            return (
              <Link 
                key={item.label}
                to={item.path} 
                onClick={onClose} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
              >
                <IconComponent size={20} className={`shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold ring-2 ring-slate-600">JD</div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-white text-sm font-medium truncate">Jane Doe</p>
            <p className="text-slate-400 text-xs">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;