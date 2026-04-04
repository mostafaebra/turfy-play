import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
  // Added 'competitions' to the navigation items
  const navItems = [
    { id: 'account', label: 'Account', icon: 'person', path: '/account' },
    { id: 'bookings', label: 'My Bookings', icon: 'calendar_month', path: '/bookings' },
    { id: 'competitions', label: 'My Competitions', icon: 'emoji_events', path: '/competitions' },
    { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet', path: '/wallet' },
  ];

  return (
    <>
      {/* ----------------- MOBILE OVERLAY ----------------- */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* ----------------- SIDEBAR CONTAINER ----------------- */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          w-64 md:w-72 
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-0 
          md:pt-6 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg font-display">
               <span className="material-symbols-outlined text-3xl">sports_soccer</span>
               Turfy Play
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* BACK TO HOME LINK */}
          <div className="px-4 pt-4 md:pt-0 pb-4">
            <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-display text-base font-bold">
                <span className="material-symbols-outlined text-xl">arrow_back_ios</span>
                Back to Home
            </Link>
          </div>

          {/* NAVIGATION LINKS */}
          <div className="flex flex-col gap-3 p-4 md:px-4 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  if (onTabChange) onTabChange(item.id);
                  if (onClose) onClose(); 
                }}
                className={`flex items-center gap-3 px-5 py-4 rounded-lg text-base font-medium transition-colors font-display ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* LOGOUT BUTTON */}
          <div className="mt-auto p-4 border-t border-gray-200 md:hidden">
             <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 transition-colors font-display">
                <span className="material-symbols-outlined text-2xl">logout</span>
                Log Out
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;