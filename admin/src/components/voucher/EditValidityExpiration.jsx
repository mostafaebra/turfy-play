import React from 'react';

// Utility to safely convert ISO string to YYYY-MM-DD for date inputs
const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toISOString().split('T')[0];
};

const EditValidityExpiration = ({ formData, handleInputChange, handleToggle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800">Validity & Expiration</h3>
        <span className="text-gray-400">📅</span>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input 
            type="date" 
            name="startDate"
            value={formatDateForInput(formData.startDate)}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B573] text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input 
            type="date" 
            name="endDate"
            value={formatDateForInput(formData.endDate)}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B573] text-gray-600"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-sm font-medium text-gray-800">Repeated Voucher</div>
            <div className="text-xs text-gray-500">Enable if this voucher repeats</div>
          </div>
          <button 
            type="button"
            onClick={() => handleToggle('isRepeated')}
            className={`w-11 h-6 rounded-full transition-colors relative ${formData.isRepeated ? 'bg-[#00B573]' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${formData.isRepeated ? 'translate-x-6' : 'translate-x-1'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditValidityExpiration;