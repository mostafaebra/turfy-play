import React, { useState, useRef, useEffect } from 'react';
import { X, User, Calendar, Receipt } from 'lucide-react';

const VerifyBookingModal = ({ isOpen, onClose, slotData }) => {
  // State for 4-digit OTP
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  // Reset OTP when modal opens
  useEffect(() => {
    if (isOpen) setOtp(['', '', '', '']);
  }, [isOpen]);

  // Handle input change (Digits only + Auto-focus next)
  const handleChange = (index, value) => {
    if (isNaN(value)) return; // Allow numbers only
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if value exists
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace (Focus previous)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in fade-in zoom-in duration-200">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center p-5 border-b bg-[#0F172A] rounded-t-2xl text-white shrink-0">
          <h2 className="text-xl font-bold">Verify Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* --- Scrollable Body --- */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Booking Details Card */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
            
            {/* Player Name */}
            <div className="flex items-start gap-3">
              <div className="mt-1 text-gray-400"><User size={18} /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Player Name</p>
                <p className="font-bold text-gray-800">{slotData?.player || "Unknown Player"}</p>
              </div>
            </div>
            
            {/* Field & Time */}
            <div className="flex items-start gap-3">
              <div className="mt-1 text-gray-400"><Calendar size={18} /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Field & Time</p>
                <p className="font-medium text-gray-700">
                   Al Ahly Field 1 • {slotData?.time} {slotData?.ampm}
                </p>
              </div>
            </div>

            {/* Booking ID */}
            <div className="flex items-start gap-3">
              <div className="mt-1 text-gray-400"><Receipt size={18} /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Booking ID</p>
                <p className="font-mono text-gray-600">#TURFY{Math.floor(Math.random() * 10000)}</p>
              </div>
            </div>
          </div>

          {/* OTP Input Section */}
          <div className="text-center space-y-4 py-2">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Enter Player OTP</h3>
              <p className="text-gray-500 text-sm">Ask the player for the code sent to their mobile.</p>
            </div>

            <div className="flex justify-center gap-2 sm:gap-3 dir-ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                />
              ))}
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
            Confirm Verification
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyBookingModal;