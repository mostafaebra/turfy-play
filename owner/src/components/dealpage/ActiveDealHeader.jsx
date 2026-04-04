// src/components/activedeal/ActiveDealHeader.jsx
import React from 'react';

const ActiveDealHeader = ({ title, isActive, launchDate }) => {
  const formattedDate = new Date(launchDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 font-display">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-extrabold text-text-dark tracking-tight">
            {title}
          </h1>
          {isActive && (
            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full tracking-wider">
              Active
            </span>
          )}
        </div>
        <p className="text-sm text-text-light flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          Campaign launched on {formattedDate}
        </p>
      </div>

      <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#EA580C] text-white rounded-xl font-bold hover:bg-[#C2410C] transition-colors shadow-md">
        <span className="material-symbols-outlined text-sm">power_settings_new</span>
        Deactivate Deal
      </button>
    </div>
  );
};

export default ActiveDealHeader;