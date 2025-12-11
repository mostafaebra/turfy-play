import React from 'react';
import { Check } from 'lucide-react';
import { facilitiesMap } from '../../../utils/mappings';

const Amenities = ({ data, onToggle }) => {
  const facilityMask = data?.facilities || 0;
  
  const allAmenities = Object.entries(facilitiesMap).map(([key, label]) => ({
    value: parseInt(key),
    label: label
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities (Select to Edit)</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {allAmenities.map((item) => {
          const isChecked = (facilityMask & item.value) === item.value;
          return (
            <div 
              key={item.value} 
              onClick={() => onToggle(item.value)} // TOGGLE ON CLICK
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none
                ${isChecked 
                  ? 'border-green-500 bg-green-50 ring-1 ring-green-500' // Highlight active
                  : 'border-gray-200 bg-white hover:bg-gray-50'}`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0
                  ${isChecked ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300'}`}>
                  {isChecked && <Check size={14} />}
              </div>
              <span className={`text-sm ${isChecked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Amenities;