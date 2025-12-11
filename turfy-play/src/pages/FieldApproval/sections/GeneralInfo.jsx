import React from 'react';
import { sportTypeMap, fieldStatusMap } from '../../../utils/mappings';

const GeneralInfo = ({ data, onChange }) => {
  const info = data || {};

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">General Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EDITABLE NAME */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Field Name</label>
          <input 
            type="text" 
            value={info.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* EDITABLE SPORT (DROPDOWN) */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Sport</label>
          <select 
            value={info.sportType}
            onChange={(e) => onChange('sportType', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {Object.entries(sportTypeMap).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* EDITABLE CONDITION (DROPDOWN) */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Condition</label>
          <select 
            value={info.fieldStatus}
            onChange={(e) => onChange('fieldStatus', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {Object.entries(fieldStatusMap).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* EDITABLE SIZE */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Field Size</label>
          <input 
            type="text" 
            value={info.fieldSize || ''}
            onChange={(e) => onChange('fieldSize', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;