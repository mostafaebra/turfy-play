import React from 'react';

export default function VoucherDetails({ formData, handleChange }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="text-emerald-500 text-xl">ℹ️</span> Voucher Details
        </h2>
        <p className="text-sm text-slate-500 mt-1">Provide core information and eligibility.</p>
      </div>
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Voucher Name</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              placeholder="e.g., Seasonal Kickoff 2024" 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600">Voucher Code</label>
            <input 
              type="text" 
              name="code" 
              required
              value={formData.code} 
              onChange={handleChange} 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all uppercase" 
              placeholder="e.g. SUMMER28" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User-friendly Type Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-600">Voucher Type</label>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="type" value={1} checked={formData.type === 1} onChange={handleChange} className="hidden peer" />
                <div className="p-3 border border-slate-200 rounded-lg peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 text-center font-medium text-slate-500 hover:bg-slate-50 transition-all">
                  Normal
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="type" value={2} checked={formData.type === 2} onChange={handleChange} className="hidden peer" />
                <div className="p-3 border border-slate-200 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 text-center font-medium text-slate-500 hover:bg-slate-50 transition-all">
                  Special
                </div>
              </label>
            </div>
          </div>

          {/* User-friendly Eligibility Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-600">Eligibility Status</label>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="eligibleStatus" value={1} checked={formData.eligibleStatus === 1} onChange={handleChange} className="hidden peer" />
                <div className="py-3 px-2 border border-slate-200 rounded-lg peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 text-center font-medium text-sm text-slate-500 hover:bg-slate-50 transition-all">
                  Trusted
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="eligibleStatus" value={2} checked={formData.eligibleStatus === 2} onChange={handleChange} className="hidden peer" />
                <div className="py-3 px-2 border border-slate-200 rounded-lg peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 text-center font-medium text-sm text-slate-500 hover:bg-slate-50 transition-all">
                  Normal
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="eligibleStatus" value={3} checked={formData.eligibleStatus === 3} onChange={handleChange} className="hidden peer" />
                <div className="py-3 px-2 border border-slate-200 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 text-center font-medium text-sm text-slate-500 hover:bg-slate-50 transition-all">
                  Abuser
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-600">Description</label>
          <textarea 
            name="description" 
            required
            value={formData.description} 
            onChange={handleChange} 
            rows="3" 
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all"
            placeholder="Terms and conditions..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}