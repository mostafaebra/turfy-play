import React, { useState, useEffect, useRef } from 'react';
import { Search, User, X, LogOut, Calendar, Wallet, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Navbar = ({ onSearchSubmit, initialSearch }) => {
  const { user, logout } = useAuth(); 
  const [inputValue, setInputValue] = useState(initialSearch || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setInputValue(initialSearch || '');
  }, [initialSearch]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val === '') onSearchSubmit('');
  };

  const handleClear = () => {
    setInputValue('');
    onSearchSubmit('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchSubmit(inputValue);
    }
  };

  // --- UPDATED HELPER FUNCTION ---
  const getDisplayName = () => {
    // 1. Try to get first name from fullName (e.g. "Mohamed Refat" -> "Mohamed")
    if (user?.fullName) {
      return user.fullName.split(' ')[0];
    }
    // 2. Fallback to username (e.g. "Mohmmad11")
    if (user?.username) {
      return user.username;
    }
    // 3. Last resort
    return 'Player';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name ? name.charAt(0).toUpperCase() : 'P';
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 md:px-8 z-50 relative sticky top-0">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 decoration-transparent">
        <div className="text-emerald-500 font-bold text-xl">⚽ Turfy Play</div>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-6 text-gray-600 font-medium">
        <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
        {user && <Link to="/bookings" className="hover:text-emerald-500 transition-colors">My Bookings</Link>}
      </div>

      <div className="flex items-center gap-4">
        
        {/* Search Bar */}
        <div className="relative hidden md:block group">
          <Search 
            onClick={() => onSearchSubmit(inputValue)}
            className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 cursor-pointer hover:text-emerald-500" 
          />
          <input 
            type="text" 
            placeholder="Search venues..." 
            className="bg-gray-50 border-none rounded-full py-2 pl-10 pr-8 text-sm w-64 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown} 
          />
          {inputValue && (
            <button onClick={handleClear} className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500">
                <X size={14} />
            </button>
          )}
        </div>
        
        {/* --- DYNAMIC USER SECTION --- */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full transition-colors border border-gray-200 pr-4"
            >
              {/* Avatar Circle */}
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                {getInitials()}
              </div>
              
              {/* Player Name (Now shows First Name) */}
              <span className="text-sm font-bold text-slate-700 hidden sm:block">
                {getDisplayName()}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  {/* Full Name in Dropdown header for clarity */}
                  <p className="text-sm font-bold text-slate-800">{user.fullName || user.username || 'Player'}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>

                <Link to="/bookings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <Calendar size={16} /> My Bookings
                </Link>
                <Link to="/wallet" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <Wallet size={16} /> My Wallet
                </Link>
                <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <Settings size={16} /> My Account
                </Link>
                
                <div className="h-px bg-gray-100 my-1"></div>
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <button className="text-slate-600 font-bold text-sm hover:text-emerald-500 px-3 py-2">
                Log In
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md transition-all active:scale-95">
                Sign Up
              </button>
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;