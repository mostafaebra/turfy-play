import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, Navigation, ChevronDown, Check } from 'lucide-react';

const FILTERS_LOCALSTORAGE_KEY = 'field_filters_v1';

const FilterSidebar = ({ filters, setFilters, isOpen, onClose }) => {
  // State for popups
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Refs for click-outside logic
  const locationRef = useRef(null);
  const sortRef = useRef(null);

  // ---- Load filters from localStorage ONCE (for hydration) ----
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FILTERS_LOCALSTORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ignore "setFilters" if parsed is same as current
        // Optional: Only do if at least one value is non-empty (to not overwrite default)
        if (
          parsed &&
          typeof parsed === 'object' &&
          JSON.stringify(parsed) !== JSON.stringify(filters)
        ) {
          setFilters(parsed);
        }
      }
    } catch (e) {
      // Ignore
    }
    // eslint-disable-next-line
  }, []); // Only run once on mount

  // ---- Save filters to localStorage WHENEVER FILTERS CHANGE ----
  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_LOCALSTORAGE_KEY, JSON.stringify(filters));
    } catch (e) {
      // Ignore
    }
  }, [filters]);

  // Combined Click Outside Handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    if (field === 'sort') setIsSortOpen(false);
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      // Suppress browser extension errors
      const originalError = window.onerror;
      window.onerror = (message, source, lineno, colno, error) => {
        // Ignore browser extension errors
        if (message && (
          message.includes('runtime.lastError') ||
          message.includes('message channel closed') ||
          message.includes('background page') ||
          message.includes('extensionAdapter') ||
          message.includes('sendMessageToTab') ||
          message.includes('invalid arguments')
        )) {
          return true; // Suppress the error
        }
        if (originalError) {
          return originalError(message, source, lineno, colno, error);
        }
        return false;
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Restore original error handler
          window.onerror = originalError;
          setFilters(prev => ({ 
            ...prev, 
            location: 'Current Location',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
          setIsLocationOpen(false);
        },
        (error) => {
          // Restore original error handler
          window.onerror = originalError;
          // Only show alert for actual geolocation errors, not extension errors
          if (error.code !== error.PERMISSION_DENIED && error.code !== error.POSITION_UNAVAILABLE) {
            console.warn('Geolocation error:', error);
          }
          alert("Could not get location. Please check your browser permissions.");
          setIsLocationOpen(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const baseClasses = "w-64 bg-white h-screen overflow-y-auto py-6 px-6 border-r border-gray-100 transition-transform duration-300 ease-in-out z-40";
  const responsiveClasses = `
    fixed top-0 left-0 
    lg:static lg:translate-x-0 
    ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
  `;

  // Updated sort options with "Highest Price" at the top
  const sortOptions = [
    "Best Match",
    "Highest Price",
    "Lowest Price",
    "Highest Rated",
    "Nearest to Me"
  ];

  // Updated sports options per instruction - mapping to match API expectations
  // Note: API uses "Soccer" (0) but UI shows "Football" - we'll map it in the service
  const sportsOptions = [
    "Football", // Maps to "Soccer" in API (SPORT_TYPE_MAP)
    "Basketball",
    "Tennis",
    "Volleyball",
    "Paddel", // Note: API uses "Padel" but UI shows "Paddel"
    "Squash"
  ];

  // Helper: group sports 2 per row
  function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  const sportsRows = chunkArray(sportsOptions, 2);

  // "Clear All" handler: reset and remove from storage too
  const handleClearAll = () => {
    setFilters({ sort: 'Best Match', location: '', type: '', priceMin: '', priceMax: '', rating: 'Any', lat: null, lng: null });
    localStorage.removeItem(FILTERS_LOCALSTORAGE_KEY);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={onClose}></div>}

      <aside className={`${baseClasses} ${responsiveClasses}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Filters</h2>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600"><X /></button>
          <button
            // "Clear All" passes empty values for all filters (no default values)
            onClick={handleClearAll}
            className="hidden lg:block text-sm text-emerald-500 hover:text-emerald-700 font-medium"
          >
            Clear all
          </button>
        </div>

        {/* --- CUSTOM SORT DROPDOWN --- */}
        <div className="mb-6 relative" ref={sortRef}>
          <label className="block text-sm font-bold text-gray-700 mb-2">Sort By</label>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className={`w-full flex items-center justify-between p-2.5 bg-white border rounded-lg text-sm outline-none transition-all ${isSortOpen ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-400'}`}
          >
            <span className="text-slate-700">{filters.sort || "Choose sorting..."}</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSortOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleInputChange('sort', option)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                    ${filters.sort === option 
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {option}
                  {filters.sort === option && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- LOCATION POPUP --- */}
        <div className="mb-6 relative" ref={locationRef}>
          <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
          <button
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="w-full flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg text-sm hover:border-emerald-500 transition-colors group"
          >
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin size={16} className="text-gray-400 group-hover:text-emerald-500" />
              <span className="truncate max-w-[140px]">
                {filters.location || "Select Location"}
              </span>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLocationOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
              <input
                type="text"
                placeholder="Type city..." 
                className="w-full p-2 border border-gray-200 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={filters.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                autoFocus
              />
              <button
                onClick={handleGetLocation}
                className="w-full flex items-center justify-center gap-2 p-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition"
              >
                <Navigation size={14} /> Use my location
              </button>
            </div>
          )}
        </div>

        {/* Sport Type */}
        <div className="mb-6 border-t border-gray-100 pt-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Sport Type</label>
          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            {sportsRows.map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                {row.map(sport => (
                  <label key={sport} className="flex items-center cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="radio"
                        name="sportType"
                        checked={filters.type === sport}
                        onChange={() => handleInputChange('type', sport)}
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-emerald-500 checked:bg-emerald-500 transition-all"
                      />
                      {/* Fake Checkmark/Dot for Custom Radio */}
                      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                        <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <span className="ml-2 text-slate-600 group-hover:text-slate-900">{sport}</span>
                  </label>
                ))}
                {/* If odd number of sports, fill empty for last cell */}
                {row.length < 2 && <div />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6 border-t border-gray-100 pt-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Price Range ($/hr)</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-gray-400 text-xs">$</span>
              <input
                type="number"
                placeholder="10"
                className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                value={filters.priceMin}
                onChange={(e) => handleInputChange('priceMin', e.target.value)}
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-gray-400 text-xs">$</span>
              <input
                type="number"
                placeholder="200"
                className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                value={filters.priceMax}
                onChange={(e) => handleInputChange('priceMax', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6 border-t border-gray-100 pt-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Rating</label>
          <select
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-emerald-500"
            value={filters.rating}
            onChange={(e) => handleInputChange('rating', e.target.value)}
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;