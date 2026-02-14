import React, { useState, useEffect, useRef } from 'react';

// --- 1. Custom Dropdown Component (Removes default browser arrows) ---
const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full md:w-56" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          isOpen 
            ? 'border-primary ring-2 ring-primary/20 text-primary bg-primary/5' 
            : 'border-border-color bg-light-gray text-text-dark hover:border-primary/50'
        }`}
      >
        <span>{value}</span>
        {/* Custom Chevron Icon (Rotates on open) */}
        <span className={`material-symbols-outlined text-xl transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-border-color bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-4 py-3 text-sm font-medium transition-colors ${
                  value === option
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-dark hover:bg-light-gray'
                }`}
              >
                {option}
                {/* Checkmark for selected item */}
                {value === option && (
                  <span className="material-symbols-outlined ml-auto text-lg">check</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- 2. Main Component ---
const TransactionHistory = ({ transactions, loading, filter, setFilter, date, setDate }) => {
  
  return (
    <div className="bg-white rounded-2xl border border-border-color p-6 md:p-8 shadow-sm font-display">
      
      {/* Header & Filters Container */}
      <div className="flex flex-col gap-6 border-b border-border-color pb-6 lg:flex-row lg:items-center lg:justify-between">
        
        <h2 className="text-2xl font-bold leading-tight text-text-dark">
          Transaction History
        </h2>
        
        {/* Filters Group */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full lg:w-auto">
          
          {/* Custom Dropdown */}
          <CustomDropdown 
            options={['All Transactions', 'Credit', 'Debit']}
            value={filter}
            onChange={setFilter}
          />

          {/* Modern Date Picker Trigger */}
          <div className="relative w-full md:w-56 group">
            <div className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 bg-light-gray ${
                date ? 'border-primary text-text-dark' : 'border-border-color text-text-light'
            } group-hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary`}>
                
                {/* Display Value or Placeholder */}
                <span className={date ? 'text-text-dark' : 'text-text-light'}>
                    {date || "Select Date"}
                </span>

                {/* Custom Calendar Icon */}
                <span className="material-symbols-outlined text-xl text-text-light group-hover:text-primary transition-colors">
                    calendar_month
                </span>
            </div>

            {/* Invisible Native Input (Overlay) */}
            {/* This keeps the native mobile date picker functionality but hides the ugly default styling */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>

        </div>
      </div>

      {/* List Content */}
      <div className="flow-root mt-6">
        {loading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-20 bg-light-gray animate-pulse rounded-xl"></div>)}
          </div>
        ) : transactions.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-12 text-center">
             <div className="h-16 w-16 bg-light-gray rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-text-light">receipt_long</span>
             </div>
             <p className="text-text-dark font-bold text-lg">No transactions found</p>
             <p className="text-text-light text-sm mt-1">Try adjusting your filters to see more results.</p>
           </div>
        ) : (
          <div className="-my-4 divide-y divide-border-color">
            {transactions.map((t) => (
              <div key={t.id} className="group flex items-center justify-between py-5 transition-colors hover:bg-light-gray/30 -mx-4 px-4 rounded-lg">
                <div className="flex items-center gap-4">
                    {/* Icon based on transaction type */}
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        t.isCredit ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-500'
                    }`}>
                        <span className="material-symbols-outlined text-xl">
                            {t.isCredit ? 'arrow_downward' : 'arrow_upward'}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-dark group-hover:text-primary transition-colors">
                            {t.type}
                        </p>
                        <p className="text-xs font-medium text-text-light mt-0.5">
                            {t.date}
                        </p>
                    </div>
                </div>
                
                <p className={`text-base font-bold tabular-nums ${t.isCredit ? 'text-primary' : 'text-red-500'}`}>
                  {t.isCredit ? '+' : '-'} {t.amount} EGP
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;