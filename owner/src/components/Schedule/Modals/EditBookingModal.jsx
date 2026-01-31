import React from 'react';
import { X, Trash2 } from 'lucide-react';

const EditBookingModal = ({ isOpen, onClose, slotData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      
      {/* Modal Container: Max height constrained with internal scrolling */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in fade-in zoom-in duration-200">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center p-5 border-b bg-[#0F172A] rounded-t-2xl text-white shrink-0">
          <h2 className="text-lg font-bold">Edit / Cancel Offline Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Read-only Info Block */}
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
            <div>
              <p className="text-gray-500 text-xs uppercase mb-1">Field Name</p>
              <p className="font-semibold text-gray-800">Al Ahly Field 1</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs uppercase mb-1">Date & Time</p>
              <p className="font-semibold text-gray-800">
                {slotData?.time} {slotData?.ampm}
              </p>
            </div>
            <div>
               <p className="text-gray-500 text-xs uppercase mb-1">Price</p>
               <p className="font-semibold text-blue-600">{slotData?.price} EGP</p>
            </div>
            <div className="text-right">
               <p className="text-gray-500 text-xs uppercase mb-1">Booking ID</p>
               <p className="font-mono text-gray-600">#OFFLINE789</p>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 border-b pb-2">Customer Details</h3>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Customer Name</label>
              <input 
                type="text" 
                defaultValue={slotData?.player || "Captain Mohamed"} 
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
              <div className="flex">
                <span className="bg-gray-100 border border-r-0 rounded-l-lg px-3 py-2 text-gray-500">+20</span>
                <input 
                  type="text" 
                  defaultValue="100 123 4567" 
                  className="w-full border rounded-r-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Status Toggle */}
          <div className="space-y-3">
             <h3 className="font-medium text-gray-700">Payment Status</h3>
             <div className="flex gap-4 p-1">
                {/* Paid Option */}
                <label className="flex-1 relative cursor-pointer group">
                  <input type="radio" name="payment_edit" className="peer sr-only" defaultChecked={slotData?.paymentStatus !== 'Unpaid'} />
                  <div className="p-3 text-center border rounded-lg peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-all font-medium text-gray-600">
                    Paid (Cash)
                  </div>
                </label>
                
                {/* Unpaid Option */}
                <label className="flex-1 relative cursor-pointer group">
                  <input type="radio" name="payment_edit" className="peer sr-only" defaultChecked={slotData?.paymentStatus === 'Unpaid'} />
                  <div className="p-3 text-center border rounded-lg peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 transition-all font-medium text-gray-600">
                    Unpaid
                  </div>
                </label>
             </div>
          </div>

        </div>

        {/* --- Footer --- */}
        {/* Responsive Flex: Stacks vertically on mobile, row on desktop */}
        <div className="p-5 border-t bg-gray-50 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 rounded-b-2xl shrink-0">
          
          {/* Cancel Button (Destructive) */}
          <button className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
            <Trash2 size={18} />
            <span className="font-medium">Cancel Booking</span>
          </button>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
                Close
            </button>
            <button className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm shadow-green-200 transition-colors">
                Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditBookingModal;