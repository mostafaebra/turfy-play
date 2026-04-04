import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveFieldsList = ({ fields, currentFieldId, onSelectField }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Active Fields</h2>
        <button 
          onClick={() => navigate('/my-fields')} 
          className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
        >
          Manage All Fields
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <div 
            key={field.fieldId} 
            className={`border rounded-xl p-4 flex items-center justify-between transition-shadow bg-white ${currentFieldId === field.fieldId ? 'border-green-500 ring-1 ring-green-500 shadow-md' : 'border-gray-100 hover:shadow-md'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-inner">
                <span className="text-white font-bold opacity-50">⚽</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{field.fieldName}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active / Approved
                </p>
              </div>
            </div>
            <button 
              onClick={() => onSelectField(field.fieldId)} 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${currentFieldId === field.fieldId ? 'bg-green-50 text-green-700' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              {currentFieldId === field.fieldId ? 'Viewing' : 'Manage'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFieldsList;