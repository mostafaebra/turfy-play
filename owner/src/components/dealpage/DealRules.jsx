// src/components/dealpage/DealRules.jsx
import React from 'react';

const DealRules = ({ data }) => {
  // Defensive check to avoid crashing if data is missing
  if (!data) return null;

  return (
    <section className="bg-white p-6 rounded-2xl border border-border-color font-display">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-text-dark">
        <span className="material-symbols-outlined text-secondary">rule</span>
        Deal Rules & Terms
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-text-light tracking-wider">Discount Rate</label>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-secondary">{data.discountRate || "0%"} Off</span>
            <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded font-bold uppercase">
              {data.discountType || "FLAT RATE"}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-text-light tracking-wider">Applicable Fields</label>
          <div className="flex flex-wrap gap-2">
            {data.fields?.length > 0 ? data.fields.map((field, index) => (
              <span key={index} className="px-3 py-1 bg-light-gray border border-border-color rounded-lg text-sm font-medium text-text-dark">
                {field}
              </span>
            )) : <span className="text-sm text-text-light">All Fields</span>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-text-light tracking-wider">Valid Time Window</label>
          <div className="flex items-center gap-2 text-text-dark font-semibold">
            <span className="material-symbols-outlined text-text-light">schedule</span>
            {data.timeWindow || "All Day"}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-text-light tracking-wider">Expiration Date</label>
          <div className="flex items-center gap-2 text-text-dark font-semibold">
            <span className="material-symbols-outlined text-text-light">event</span>
            {data.expirationDate || "N/A"}
          </div>
        </div>
      </div>

      {data.conditions?.length > 0 && (
        <div className="mt-8 pt-8 border-t border-border-color">
          <h4 className="text-sm font-bold mb-4 uppercase text-text-light tracking-widest">Additional Conditions</h4>
          <ul className="space-y-3">
            {data.conditions.map((condition, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-text-dark">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                {condition}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default DealRules;