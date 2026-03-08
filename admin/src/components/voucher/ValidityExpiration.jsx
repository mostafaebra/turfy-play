import React from 'react';

export default function ValidityExpiration({ formData, handleChange }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="text-emerald-500 text-xl">📅</span> Validity & Expiration
        </h2>
      </div>
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Start Date</label>
            <input 
              type="date" 
              name="startDate" 
              required
              value={formData.startDate} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer" 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">End Date</label>
            <input 
              type="date" 
              name="endDate" 
              required
              value={formData.endDate} 
              onChange={handleChange} 
              min={formData.startDate} /* Prevent end date before start date */
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}