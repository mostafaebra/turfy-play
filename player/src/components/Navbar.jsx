import React, { useState, useEffect } from 'react';
import { Search, User, X } from 'lucide-react';

const Navbar = ({ onSearchSubmit, initialSearch }) => {
  // Sync local state if parent changes (e.g. from URL)
  const [inputValue, setInputValue] = useState(initialSearch || '');

  // Junior Fix: If the user manually clears the text to empty string, 
  // we should probably auto-trigger the reset without waiting for Enter.
  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val === '') {
      onSearchSubmit(''); // Clear results immediately if input is empty
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearchSubmit('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit(inputValue);
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 md:px-8 z-50 relative">
      <div className="flex items-center gap-2">
        <div className="text-emerald-500 font-bold text-xl">⚽ Turfy Play</div>
      </div>

      <div className="hidden md:flex gap-6 text-gray-600 font-medium">
        <a href="#" className="text-black">Home</a>
        <a href="#">My Bookings</a>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block group">
          <Search 
            onClick={() => onSearchSubmit(inputValue)}
            className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 cursor-pointer hover:text-emerald-500" 
          />
          <input 
            type="text" 
            placeholder="San Francisco" 
            className="bg-gray-50 border-none rounded-full py-2 pl-10 pr-8 text-sm w-64 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown} 
          />
          {/* New Clear Button: Only shows if there is text */}
          {inputValue && (
            <button 
                onClick={handleClear}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
            >
                <X size={14} />
            </button>
          )}
        </div>
        
        <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 cursor-pointer">
          <User className="w-5 h-5" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;