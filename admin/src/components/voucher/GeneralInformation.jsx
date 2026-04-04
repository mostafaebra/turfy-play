import React from 'react';

const GeneralInformation = ({ formData, handleInputChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800">General Information</h3>
        <span className="text-gray-400 cursor-pointer">✏️</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B573]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
          <select 
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B573] bg-white"
          >
            <option value={1}>Normal</option>
            <option value={2}>Special</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
          <div className="relative">
            <input 
              type="number" 
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              max="100"
              min="0"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B573]"
            />
            <span className="absolute right-4 top-2 text-gray-400">%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Usage Limit</label>
          <input 
            type="number" 
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B573]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount Amount</label>
          <input 
            type="number" 
            name="maxDiscountAmount"
            value={formData.maxDiscountAmount}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B573]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Limit Per User</label>
          <input 
            type="number" 
            name="limitPerUser"
            value={formData.limitPerUser}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B573]"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Booking Value</label>
          <input 
            type="number" 
            name="minBookingValue"
            value={formData.minBookingValue}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B573]"
          />
        </div>

        {/* Updated Eligibility Field */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Status</label>
          <select 
            name="eligibleStatus"
            value={formData.eligibleStatus}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B573] bg-white"
          >
            <option value={1}>Trusted</option>
            <option value={2}>Normal</option>
            <option value={3}>Abuser</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformation;