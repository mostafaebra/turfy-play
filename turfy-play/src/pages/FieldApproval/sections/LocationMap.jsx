import React from 'react';

const LocationMap = ({ data }) => {
  const info = data || {};

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Address Inputs */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Full Address</label>
            <input 
              type="text" 
              readOnly
              value={info.address || ''}
              className="w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Latitude</label>
              <input 
                type="text" 
                readOnly
                value={info.latitude || ''}
                className="w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Longitude</label>
              <input 
                type="text" 
                readOnly
                value={info.longitude || ''}
                className="w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Map Placeholder */}
        <div className="flex-1">
          <div className="w-full h-40 rounded-lg overflow-hidden relative border border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600&h=300" 
              alt="Map Location" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;