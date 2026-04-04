import React from 'react';

export default function UsageRestrictions({ formData, handleChange }) {
  const isNormal = formData.type === 1;
  const maxDiscount = isNormal ? 100 : 50;

  // Reusable class for number inputs to hide the browser's default spin arrows
  const noArrowsClass = "w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="text-red-500 text-xl">🚫</span> Usage Restrictions
        </h2>
      </div>
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
               <label className="block text-sm font-semibold text-slate-600">Discount Percentage</label>
               <span className="text-xs font-medium text-slate-400">Max: {maxDiscount}%</span>
            </div>
            <div className="relative">
              <input 
                type="number" 
                name="discountPercentage" 
                required
                value={formData.discountPercentage} 
                onChange={handleChange} 
                min="0" 
                max={maxDiscount} 
                placeholder={`0 - ${maxDiscount}`}
                className={noArrowsClass} 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Max Discount Amount</label>
            <div className="relative">
              <input 
                type="number" 
                name="maxDiscountAmount" 
                required
                value={formData.maxDiscountAmount} 
                onChange={handleChange} 
                min="0"
                placeholder="0.00"
                className={noArrowsClass} 
              />
               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">EGP</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Total Usage Limit</label>
            <input type="number" required name="usageLimit" min="1" placeholder="e.g. 100" value={formData.usageLimit} onChange={handleChange} className={noArrowsClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Limit Per User</label>
            <input type="number" required name="limitPerUser" min="1" placeholder="e.g. 1" value={formData.limitPerUser} onChange={handleChange} className={noArrowsClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Min Booking Value</label>
            <input type="number" required name="minBookingValue" min="0" placeholder="0.00" value={formData.minBookingValue} onChange={handleChange} className={noArrowsClass} />
          </div>
        </div>
      </div>
    </div>
  );
}