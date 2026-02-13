import React from "react";

export default function SidebarFilters({ filters, setFilters, onApply }) {
  
  const handleCheckboxChange = (category, id) => {
    const currentItems = filters[category] || [];
    const updatedItems = currentItems.includes(id)
      ? currentItems.filter(item => item !== id)
      : [...currentItems, id];
    
    setFilters({ ...filters, [category]: updatedItems });
  };

  const sports = [
    { id: 1, name: "Football" },
    { id: 2, name: "Basketball" },
    { id: 3, name: "Tennis" },
    { id: 4, name: "Volleyball" },
    { id: 5, name: "Paddel" },
    { id: 6, name: "Squash" }
  ];

  return (
    
    <div className="lg:sticky lg:top-24 h-fit bg-white p-6 rounded-2xl border border-gray-50 shadow-sm font-display">
      { }
      
      {/* Header Filters */}
      <div className="flex justify-between items-center">
        <h2 className="font-black text-xl md:text-2xl text-[#1E293B]">Filters</h2>
        <button 
          onClick={() => {
            setFilters({ searchTerm: "", location: "", sportTypes: [], competitionTypes: [], minPrice: 0, maxPrice: 2000, limit: 10 });
            onApply();
          }}
          className="text-[#22C55E] text-sm font-bold hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* 1. Sport Type - Grid 2 Columns */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <h4 className="font-black text-sm text-[#1E293B] uppercase tracking-wide">Sport Type</h4>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2"> 
          {sports.map((sport) => (
            <label key={sport.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={filters.sportTypes.includes(sport.id)}
                  onChange={() => handleCheckboxChange('sportTypes', sport.id)}
                  className="w-5 h-5 accent-[#22C55E] rounded border-gray-300 cursor-pointer transition-transform group-hover:scale-110 shadow-sm" 
                />
              </div>
              <span className="text-[13px] md:text-sm font-bold text-gray-500 group-hover:text-[#1E293B] transition-colors whitespace-nowrap">
                {sport.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Competition Level */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <h4 className="font-black text-sm text-[#1E293B] uppercase tracking-wide">Competition Level</h4>
        <div className="space-y-3">
          {[
            { id: 1, name: "Beginners" },
            { id: 2, name: "Intermediate" },
            { id: 3, name: "Professional" }
          ].map((type) => (
            <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.competitionTypes.includes(type.id)}
                onChange={() => handleCheckboxChange('competitionTypes', type.id)}
                className="w-5 h-5 accent-[#22C55E] rounded-md border-gray-300 cursor-pointer shadow-sm" 
              />
              <span className="text-[13px] md:text-sm font-bold text-gray-500 group-hover:text-[#1E293B] transition-colors">{type.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Location */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <h4 className="font-black text-sm text-[#1E293B] uppercase tracking-wide">Location</h4>
        <select 
          className="w-full bg-[#F3F4F6] border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#22C55E]/20 transition-all appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
        >
          <option value="">All Locations</option>
          <option value="Maadi">Maadi</option>
          <option value="New Cairo">New Cairo</option>
        </select>
      </div>

      {/* 4. Entry Fee Slider */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <div className="flex justify-between items-center">
          <h4 className="font-black text-sm text-gray-400 uppercase tracking-wide">Entry Fee (EGP)</h4>
          <span className="text-[#22C55E] font-black text-sm bg-green-50 px-2 py-1 rounded-md">{filters.maxPrice}</span>
        </div>
        <input 
          type="range" 
          min="0" max="2000" step="50"
          value={filters.maxPrice}
          onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#22C55E]" 
        />
        <div className="flex justify-between text-[11px] font-black text-gray-400">
          <span>0</span>
          <span>2000+</span>
        </div>
      </div>

      {/* Apply Button */}
      <button 
        onClick={onApply}
        className="w-full bg-[#22C55E] text-white py-2 rounded-xl font-black text-lg shadow-lg shadow-green-100 hover:bg-[#1eb054] transition-all transform active:scale-[0.97]"
      >
        Apply Filters
      </button>
    </div>
  );
}