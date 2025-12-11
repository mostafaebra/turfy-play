import React from 'react';

const Pricing = ({ data, onChange }) => {
  const info = data || {};
  
  // Get verification images (support casing variations just in case)
  const verificationList = info.verificationImages || info.VerificationImages || [];

  const formatTimeForInput = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  return (
    <div className="space-y-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Schedule</h2>
            <div className="flex flex-col md:flex-row gap-6">
                
                {/* EDITABLE PRICE */}
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Hourly Rate</label>
                    <div className="relative max-w-xs">
                        <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                        <input 
                            type="number" 
                            value={info.defaultPrice || 0}
                            onChange={(e) => onChange('defaultPrice', parseFloat(e.target.value))}
                            className="w-full border border-gray-300 rounded-md pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>
                
                {/* EDITABLE HOURS */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Opening</label>
                        <input 
                            type="time" 
                            value={formatTimeForInput(info.openingFrom)}
                            onChange={(e) => onChange('openingFrom', e.target.value + ":00")} 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Closing</label>
                        <input 
                            type="time" 
                            value={formatTimeForInput(info.openingUntil)}
                            onChange={(e) => onChange('openingUntil', e.target.value + ":00")}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                     </div>
                </div>
            </div>
        </div>

        {/* UPDATED: Read-Only Verification Gallery */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Documents (Read Only)</h2>
            
            {verificationList.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {verificationList.map((imgUrl, index) => (
                        <a 
                            key={index} 
                            href={imgUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
                        >
                            <img 
                                src={imgUrl} 
                                alt={`Doc ${index + 1}`} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 bg-white text-xs px-2 py-1 rounded shadow text-gray-700 font-medium">
                                    View Full
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400 italic">No verification documents uploaded.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Pricing;