import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

const AddOfflineBookingModal = ({ isOpen, onClose, slotData, fullSchedule }) => {
  const [duration, setDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [maxDuration, setMaxDuration] = useState(1);

  // 1. Initialize modal state when opened
  useEffect(() => {
    if (isOpen && slotData && fullSchedule) {
      setDuration(1);
      setTotalPrice(slotData.price);
      calculateMaxDuration();
    }
  }, [isOpen, slotData]);

  // 2. Calculate available slots ahead for duration logic
  const calculateMaxDuration = () => {
    let count = 1;
    // Find current slot index
    const currentIndex = fullSchedule.findIndex(s => s.id === slotData.id);
    
    // Check subsequent slots for availability
    for (let i = currentIndex + 1; i < fullSchedule.length; i++) {
      if (fullSchedule[i].status === 'available') {
        count++;
      } else {
        break; // Stop at first non-available slot
      }
    }
    // Limit max booking duration (e.g., 5 hours)
    setMaxDuration(Math.min(count, 5));
  };

  // 3. Update price when duration changes
  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value);
    setDuration(newDuration);
    setTotalPrice(slotData.price * newDuration);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in fade-in zoom-in duration-200">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center p-5 border-b bg-[#0F172A] rounded-t-2xl text-white shrink-0">
          <h2 className="text-xl font-bold">Add Offline Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Booking Summary Card */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
            
            {/* Top Row: Field & Time */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-1">Field</p>
                <p className="font-semibold text-gray-800">Al Ahly Field 1</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-1">Start Time</p>
                <p className="font-semibold text-gray-800">
                  {slotData?.time} {slotData?.ampm}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Bottom Row: Duration & Price */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
              
              {/* Duration Selector */}
              <div className="w-full sm:w-auto flex-1">
                <label className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-1 block">Duration</label>
                <div className="relative w-full sm:w-32">
                  <select 
                    value={duration}
                    onChange={handleDurationChange}
                    className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-green-500 font-medium"
                  >
                    {/* Generate options based on available consecutive slots */}
                    {[...Array(maxDuration)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} Hour{(i + 1) > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Clock size={14} />
                  </div>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="w-full sm:w-auto text-left sm:text-right">
                 <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-1">Total Price</p>
                 <p className="text-2xl font-bold text-blue-600">{totalPrice} <span className="text-sm font-medium text-gray-500">EGP</span></p>
              </div>
            </div>
          </div>

          {/* Customer Form */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Customer Details</h3>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Customer Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="Enter customer's full name" 
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Mobile Number <span className="text-red-500">*</span></label>
              <div className="flex">
                <span className="bg-gray-100 border border-r-0 rounded-l-lg px-3 py-2 text-gray-500">+20</span>
                <input 
                  type="text" 
                  placeholder="100 123 4567" 
                  className="w-full border rounded-r-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-3">
             <h3 className="font-medium text-gray-700">Payment Status</h3>
             <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" className="w-4 h-4 text-green-600 focus:ring-green-500" defaultChecked />
                  <span className="text-gray-700">Paid (Cash)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" className="w-4 h-4 text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Unpaid</span>
                </label>
             </div>
             
             <div>
                <label className="block text-sm text-gray-500 mb-1">Amount Received</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-2 text-gray-400">EGP</span>
                </div>
             </div>
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 shrink-0 rounded-b-2xl">
          <button 
            onClick={onClose} 
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm shadow-green-200">
            Confirm Booking
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddOfflineBookingModal;