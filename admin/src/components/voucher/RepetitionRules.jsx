import React from 'react';

export default function RepetitionRules({ formData, setFormData }) {
  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-emerald-500 material-icons">repeat</span>
        <h3 className="text-lg font-semibold text-slate-800">Repetition Rules</h3>
      </div>
      
      <div className="flex gap-4 mb-6">
        <label className="flex-1 cursor-pointer">
          <input 
            type="radio" 
            name="isRepeated" 
            checked={!formData.isRepeated} 
            onChange={() => setFormData(prev => ({ ...prev, isRepeated: false }))} 
            className="hidden peer" 
          />
          <div className="p-4 border border-slate-200 rounded-lg peer-checked:border-emerald-500 peer-checked:bg-emerald-50 text-center transition-all">
            <span className="material-icons block mb-1 text-slate-400 peer-checked:text-emerald-600">event</span>
            <span className="text-sm font-medium">One-time</span>
          </div>
        </label>
        
        <label className="flex-1 cursor-pointer">
          <input 
            type="radio" 
            name="isRepeated" 
            checked={formData.isRepeated} 
            onChange={() => setFormData(prev => ({ ...prev, isRepeated: true }))} 
            className="hidden peer" 
          />
          <div className="p-4 border border-slate-200 rounded-lg peer-checked:border-emerald-500 peer-checked:bg-emerald-50 text-center transition-all">
            <span className="material-icons block mb-1 text-slate-400 peer-checked:text-emerald-600">update</span>
            <span className="text-sm font-medium">Repeated</span>
          </div>
        </label>
      </div>
    </section>
  );
}