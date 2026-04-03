import React, { useState } from 'react';
import { X, Calendar, AlertTriangle } from 'lucide-react';

const SetPricingModal = ({ isOpen, onClose }) => {
  const [repeat, setRepeat] = useState('specific'); // 'specific' or 'weekly'
  const [selectedDays, setSelectedDays] = useState(['F']); // Friday by default

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in fade-in zoom-in duration-200">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center p-5 border-b bg-[#0F172A] rounded-t-2xl text-white shrink-0">
          <h2 className="text-xl font-bold">Set Slot Pricing</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* 1. Time Range Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-medium">From</label>
              <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                <option>06:00 PM</option>
                <option>07:00 PM</option>
                <option>08:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-medium">To</label>
              <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                <option>11:00 PM</option>
                <option>12:00 AM</option>
              </select>
            </div>
            <p className="text-xs text-gray-400 sm:col-span-2">5 Hours Selected</p>
          </div>

          {/* 2. Price Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">Price per Hour</label>
            <div className="relative">
              <input 
                type="number" 
                defaultValue={300}
                className="w-full border rounded-lg px-4 py-2 pr-12 text-lg font-bold text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
              />
              <span className="absolute right-4 top-2.5 text-gray-500 font-medium">EGP</span>
            </div>
          </div>

          {/* 3. Logic & Rules */}
          <div className="space-y-3">
            <label className="block text-sm text-gray-600 mb-1 font-medium">Apply this price to...</label>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="repeat" 
                  checked={repeat === 'specific'} 
                  onChange={() => setRepeat('specific')}
                  className="w-4 h-4 text-green-600 focus:ring-green-500" 
                />
                <span className="text-gray-700 text-sm sm:text-base">Only on Friday, Oct 27, 2023</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="repeat" 
                  checked={repeat === 'weekly'} 
                  onChange={() => setRepeat('weekly')}
                  className="w-4 h-4 text-green-600 focus:ring-green-500" 
                />
                <span className="text-gray-700 text-sm sm:text-base">Repeat Weekly</span>
              </label>
            </div>

            {/* Day Selector (Conditional Render) */}
            {repeat === 'weekly' && (
              <div className="flex flex-wrap justify-between gap-2 pt-2 animate-in slide-in-from-top-2 duration-200">
                {days.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleDay(day)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      selectedDays.includes(day)
                        ? 'bg-[#0F172A] text-white shadow-lg transform scale-110'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Date Range (Conditional Render) */}
          {repeat === 'weekly' && (
            <div className="space-y-2 pt-2 border-t border-dashed">
              <label className="block text-sm text-gray-600 mb-1 font-medium">Repeat until...</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
                <Calendar size={18} className="text-gray-400 mr-2" />
                <input type="date" className="w-full outline-none text-gray-700 bg-transparent" />
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3 items-start">
            <AlertTriangle size={18} className="text-yellow-600 mt-0.5 shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-bold">Note:</p>
              <p className="text-xs sm:text-sm">This will overwrite existing pricing. Existing bookings will not be affected.</p>
            </div>
          </div>

        </div>

        {/* --- Footer --- */}
        <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 shrink-0 rounded-b-2xl">
          <button 
            onClick={onClose} 
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm shadow-green-200 font-medium transition-colors">
            Save Pricing
          </button>
        </div>

      </div>
    </div>
  );
};

export default SetPricingModal;