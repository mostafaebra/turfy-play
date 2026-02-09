import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Clock, DollarSign, User, Phone, Calendar } from "lucide-react";
import { addOfflineBooking } from "../../../services/api";

const AddOfflineBookingModal = ({ isOpen, onClose, slotData, selectedDate, fieldId, fullSchedule, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [maxDuration, setMaxDuration] = useState(1); 
  
  const [formData, setFormData] = useState({
    playerName: "",
    phoneNumber: "",
    price: "",
    duration: 1, 
    startTime: ""
  });

  // 1️⃣ حساب الساعات المتاحة (Logic)
  useEffect(() => {
    if (isOpen && slotData && fullSchedule) {
      const timeParts = slotData.realTime24 ? slotData.realTime24.split(':') : ["09", "00"];
      const formattedTime = `${timeParts[0]}:${timeParts[1]}`;
      const currentHour = parseInt(timeParts[0]);

      let availableHours = 0;
      
      const upcomingSlots = fullSchedule.filter(s => {
        const h = parseInt(s.time.split(':')[0]); 
        const hour24 = s.ampm === "PM" && h !== 12 ? h + 12 : (s.ampm === "AM" && h === 12 ? 0 : h);
        return hour24 >= currentHour;
      });

      for (let slot of upcomingSlots) {
        if (slot.status === "available") {
          availableHours += 1;
        } else {
          break; 
        }
      }

      const safeMax = availableHours > 0 ? availableHours : 1;
      setMaxDuration(safeMax);

      setFormData({
        playerName: "",
        phoneNumber: "",
        price: slotData.price && slotData.price !== '-' ? slotData.price : "", 
        duration: 1, 
        startTime: formattedTime
      });
    }
  }, [isOpen, slotData, fullSchedule]);

  // 2️⃣ تحديث السعر مع المدة
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
      const numValue = parseInt(value);
      if (numValue > maxDuration) newValue = maxDuration;
      else if (numValue < 1) newValue = 1;
      else if (isNaN(numValue)) newValue = "";
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  // 👇 دالة الإرسال 👇
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fieldId) {
      alert("❌ خطأ: لم يتم تحديد الملعب! تأكد من اختيار ملعب من القائمة.");
      return;
    }

    setLoading(true);

    try {
      // ✅ نستخدم fieldId الديناميك الصحيح
      const payload = {
        fieldId: fieldId, 
        date: selectedDate,
        startTime: formData.startTime,
        duration: Number(formData.duration),
        price: Number(formData.price),
        playerName: formData.playerName,
        phoneNumber: formData.phoneNumber
      };

      console.log("🚀 Sending Payload:", JSON.stringify(payload, null, 2));

      const response = await addOfflineBooking(payload);
      
      console.log("✅ Server Response:", response);

      if (response && response.isSuccess === true) {
        alert("🎉 تم الحجز بنجاح!");
        onSuccess(); // هيعمل Refresh
        onClose();
      } else {
        alert(`:\n${response?.message} (Error: ${response?.errorCode})`);
      }

    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ حدث خطأ أثناء الاتصال بالسيرفر.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 scale-100 transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-[#111827] flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">New Booking</h2>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <Calendar size={12} /> {selectedDate} • <Clock size={12} /> {formData.startTime}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Player Info</label>
              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="playerName"
                    required
                    autoFocus
                    value={formData.playerName}
                    onChange={handleChange}
                    placeholder="Player Name"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#111827] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Booking Details</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400">Duration (Hrs)</span>
                  <input
                    type="number"
                    name="duration"
                    step="1"
                    min="1"
                    max={maxDuration} 
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#111827] outline-none transition-all"
                  />
                  <p className="text-[10px] text-green-600">Max: {maxDuration} hrs free</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400">Price (EGP)</span>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                    <input
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 bg-green-50 border border-green-200 text-green-800 font-bold rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111827] hover:bg-black text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOfflineBookingModal;