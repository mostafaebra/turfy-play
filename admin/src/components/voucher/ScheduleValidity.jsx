import React, { useMemo } from 'react';
import { Calendar, Clock, ChevronDown, ArrowRight } from 'lucide-react';

export default function ScheduleValidity({ formData, handleChange, handleDayToggle }) {
  const days = [
    { label: 'M', value: 1 }, { label: 'T', value: 2 }, { label: 'W', value: 3 },
    { label: 'T', value: 4 }, { label: 'F', value: 5 }, { label: 'S', value: 6 },
    { label: 'S', value: 0 } // Sunday is 0
  ];

  // Generate 12-hour time slots (12:00 AM - 11:30 PM)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      const hour24 = i;
      const hour12 = hour24 % 12 || 12; // Convert 0 -> 12
      const period = hour24 < 12 ? 'AM' : 'PM';
      
      // Store 24h value for logic, Display 12h for user
      const timeValue = `${hour24.toString().padStart(2, '0')}`;
      
      slots.push({ value: `${timeValue}:00`, label: `${hour12}:00 ${period}` });
      slots.push({ value: `${timeValue}:30`, label: `${hour12}:30 ${period}` });
    }
    return slots;
  }, []);

  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <Calendar className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-semibold text-slate-800">Schedule & Validity</h3>
      </div>

      <div className="space-y-8 flex-1">
        {/* Date Range Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Validity Period</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 group">
              <input 
                type="date" 
                name="startDate" 
                required
                value={formData.startDate} 
                onChange={handleChange} 
                onClick={(e) => e.target.showPicker()}
                className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer font-medium text-slate-700" 
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-emerald-500 pointer-events-none transition-colors" />
            </div>
            
            <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
            
            <div className="relative flex-1 group">
              <input 
                type="date" 
                name="endDate" 
                required
                value={formData.endDate} 
                onChange={handleChange} 
                min={formData.startDate}
                onClick={(e) => e.target.showPicker()}
                className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer font-medium text-slate-700" 
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-emerald-500 pointer-events-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Days of Week Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Applicable Day(s)</label>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => {
              const isActive = formData.daysOfWeek.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200
                    ${isActive 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-105' 
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-500'}`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection with Custom Dropdown Style */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Start Time</label>
            <div className="relative group">
              <select
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white appearance-none cursor-pointer font-medium text-slate-700 transition-all"
              >
                <option value="" disabled>--:--</option>
                {timeSlots.map((slot) => (
                  <option key={`start-${slot.value}`} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-emerald-500 pointer-events-none transition-colors" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">End Time</label>
            <div className="relative group">
              <select
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white appearance-none cursor-pointer font-medium text-slate-700 transition-all"
              >
                <option value="" disabled>--:--</option>
                {timeSlots.map((slot) => (
                  <option key={`end-${slot.value}`} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-emerald-500 pointer-events-none transition-colors" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}