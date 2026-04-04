import React from 'react';
import { Tag } from 'lucide-react';

export default function OfferDetails({ formData, handleChange }) {
  // Hide spinner arrows in number inputs
  const noSpinnerClass = "w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <Tag className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-semibold text-slate-800">Offer Details</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Offer Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium" placeholder="e.g. Weekend Special" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Code</label>
                <input type="text" name="code" required value={formData.code} onChange={handleChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white transition-all uppercase font-medium" placeholder="e.g. TURF50" />
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">Field ID / Reference Name</label>
          <input type="text" name="fieldId" value={formData.fieldId || ''} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:bg-white transition-all" placeholder="e.g. VENUE-789-TURF-1" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">Discount Percentage</label>
          <div className="relative group">
            <input 
              type="number" 
              name="discountPercentage" 
              min="0" 
              max="100" 
              value={formData.discountPercentage} 
              onChange={handleChange} 
              className={`${noSpinnerClass} bg-slate-50 focus:bg-white font-medium`}
              placeholder="0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-emerald-500">%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Enter a value between 0% and 100%.</p>
        </div>
      </div>
    </section>
  );
}