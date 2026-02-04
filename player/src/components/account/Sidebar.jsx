import React from 'react';
import { Link } from 'react-router-dom';
const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const navItems = [
    { id: 'account', label: 'Account', icon: 'person' },
    { id: 'bookings', label: 'My Bookings', icon: 'calendar_month' },
    { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet' },
  ];

  return (
    <>
      {/* ----------------- MOBILE OVERLAY ----------------- */}
      <div 
        className={`fixed inset-0 z-40 bg-dark-navy/50 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* ----------------- SIDEBAR CONTAINER ----------------- */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-border-color transition-transform duration-300 ease-in-out
          w-64 md:w-72  /* Increased width on desktop */
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-0 
          md:pt-6       /* Reduced top padding (was pt-24) */
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* MOBILE HEADER (Logo + Close Button) */}
          <div className="flex items-center justify-between p-4 border-b border-border-color md:hidden">
            <div className="flex items-center gap-2 text-primary font-bold text-lg font-display">
               <span className="material-symbols-outlined text-3xl">sports_soccer</span>
               Turfy Play
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-text-light hover:bg-light-gray hover:text-text-dark transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* BACK TO HOME LINK */}
          <div className="px-4 pt-4 md:pt-0 pb-4">
            <Link to="/" className="flex items-center gap-2 text-text-light hover:text-text-dark transition-colors font-display text-base font-bold">
                <span className="material-symbols-outlined text-xl">arrow_back_ios</span>
                Back to Home
            </Link>
          </div>

          {/* NAVIGATION LINKS */}
          <div className="flex flex-col gap-3 p-4 md:px-4 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose(); 
                }}
                className={`flex items-center gap-3 px-5 py-4 rounded-lg text-base font-medium transition-colors font-display ${
                  activeTab === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-light hover:bg-light-gray hover:text-text-dark'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* LOGOUT BUTTON (Mobile Only) */}
          <div className="mt-auto p-4 border-t border-border-color md:hidden">
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