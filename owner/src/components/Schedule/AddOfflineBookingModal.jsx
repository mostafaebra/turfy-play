import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Clock, DollarSign, User, Phone, Calendar } from "lucide-react";
import { addOfflineBooking } from "../../services/scheduleApi";

const AddOfflineBookingModal = ({ isOpen, onClose, slotData, selectedDate, fieldId, fullSchedule, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    playerName: "",
    phoneNumber: "",
    price: "",
    duration: 1, 
    startTime: ""
  });

  // Determine actual booking date (handles next-day/late-night slots)
  const bookingDate = slotData?.actualDate || selectedDate;

  useEffect(() => {
    if (isOpen && slotData) {
      const timeParts = slotData.realTime24 ? slotData.realTime24.split(':') : ["09", "00"];
      const formattedTime = `${timeParts[0]}:${timeParts[1]}`;

      setFormData({
        playerName: "",
        phoneNumber: "",
        price: slotData.price && slotData.price !== '-' ? slotData.price : "", 
        duration: 1, 
        startTime: formattedTime
      });
    }
  }, [isOpen, slotData]);

  // Update price when duration changes
  useEffect(() => {
    if (slotData?.price && !isNaN(slotData.price)) {
      const unitPrice = parseFloat(slotData.price);
      const newPrice = unitPrice * formData.duration;
      setFormData(prev => ({ ...prev, price: newPrice }));
    }
  }, [formData.duration, slotData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "duration") {
        newValue = Math.max(1, Math.min(6, parseInt(value) || 1)); 
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fieldId) { alert("❌ Error: No Field Selected"); return; }
    
    setLoading(true);
    try {
      const payload = {
        fieldId: fieldId, 
        date: bookingDate, // Correct date (e.g., handles post-midnight dates)
        startTime: formData.startTime,
        duration: Number(formData.duration),
        price: Number(formData.price),
        playerName: formData.playerName,
        phoneNumber: formData.phoneNumber
      };

      console.log("Sending Booking Payload:", JSON.stringify(payload, null, 2));
      const response = await addOfflineBooking(payload);
      
      if (response && response.isSuccess === true) {
        alert("🎉 Booking Confirmed Successfully!");
        onSuccess(); 
        onClose();
      } else {
        alert(`⚠️ Booking Failed:\n${response?.message || "Unknown Error"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("❌ Server Connection Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-[#111827] flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">New Booking</h2>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
               <span className="flex items-center gap-1 text-green-400 font-bold"><Calendar size={12} /> {bookingDate}</span>
               <span className="text-gray-600">|</span>
               <span className="flex items-center gap-1 text-white font-mono"><Clock size={12} /> {formData.startTime}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full"><X size={18} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            
            {/* Player Info */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Player Info</label>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input type="text" name="playerName" required autoFocus value={formData.playerName} onChange={handleChange} placeholder="Player Name" className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#111827] outline-none transition-all" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#111827] outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Details</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400">Duration (Hrs)</span>
                  <input type="number" name="duration" min="1" max="6" required value={formData.duration} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#111827] outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400">Price (EGP)</span>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                    <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full pl-8 pr-3 py-2 bg-green-50 border border-green-200 text-green-800 font-bold rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#111827] hover:bg-black text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOfflineBookingModal;