import React, { useState, useEffect } from "react";
import { X, Save, Trash2, Loader2, User, Phone, DollarSign, Calendar, Clock, Edit2 } from "lucide-react";
import { getOfflineBookingDetails, updateOfflineBooking, deleteOfflineBooking } from "../../../services/api";

const EditBookingModal = ({ isOpen, onClose, slotData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  // State to hold original data for backend identification (oldData)
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    fieldId: 0,
    playerName: "",
    phoneNumber: "",
    price: "",
    duration: 1, 
    date: "",
    startTime: ""
  });

  // Fetch details on modal open
  useEffect(() => {
    if (isOpen && slotData?.id) {
      fetchDetails(slotData.id);
    }
  }, [isOpen, slotData]);

  const fetchDetails = async (id) => {
    setFetching(true);
    try {
      const response = await getOfflineBookingDetails(id);
      const data = response.data || response; 

      if (data) {
        // Prepare date format
        const formattedDate = data.date ? data.date.split("T")[0] : "";
        
        // Save original data snapshot for the update payload
        setOriginalData({
            date: formattedDate,
            startTime: data.startTime, 
            duration: Number(data.duration)
        });

        // Set form data for editing
        setFormData({
          fieldId: data.fieldId, 
          playerName: data.playerName,
          phoneNumber: data.phoneNumber,
          price: data.price,
          duration: data.duration,
          date: formattedDate,
          startTime: data.startTime
        });
      }
    } catch (error) {
      console.error("Failed to load details", error);
      alert("Failed to load booking details");
      onClose();
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update function: Sends both old and new data
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Construct payload as required by backend
      const payload = {
        fieldId: formData.fieldId,
        
        // Original Data
        oldDate: originalData.date,
        oldStartTime: originalData.startTime,
        oldDuration: Number(originalData.duration),

        // New Data (Edited)
        newDate: formData.date,
        newStartTime: formData.startTime,
        newDuration: Number(formData.duration),
        newPrice: Number(formData.price),
        
        playerName: formData.playerName,
        phoneNumber: formData.phoneNumber
      };

      console.log("Sending Update Payload:", payload);

      const res = await updateOfflineBooking(payload);
      if (res && (res.isSuccess || res.success === true)) {
        alert("✅ Booking Updated Successfully!");
        onSuccess(); 
        onClose();
      } else {
        alert("⚠️ Update Failed: " + (res.message || "Unknown error"));
      }
    } catch (error) {
      alert("❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  // Delete function: Cancels the booking
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setLoading(true);
    try {
      const payload = {
        fieldId: formData.fieldId, 
        date: originalData?.date || formData.date, // Use original date for safety
        startTime: originalData?.startTime || formData.startTime,
        duration: Number(originalData?.duration || formData.duration)
      };

      const res = await deleteOfflineBooking(payload);
      if (res && (res.isSuccess || res.success === true)) {
        alert("🗑️ Booking Cancelled Successfully!");
        onSuccess(); 
        onClose();
      } else {
        alert("⚠️ Delete Failed: " + (res.message || "Unknown error"));
      }
    } catch (error) {
      alert("❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        
        <div className="px-6 py-4 border-b bg-[#111827] flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Edit2 size={18} className="text-blue-400" /> Edit Booking
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full"><X size={18} /></button>
        </div>

        {fetching ? (
            <div className="p-10 flex flex-col items-center justify-center text-gray-500 gap-2">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p>Loading details...</p>
            </div>
        ) : (
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
            
            {/* Editable Date & Time */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-semibold flex items-center gap-1"><Calendar size={12}/> New Date</label>
                    <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full bg-white px-2 py-1 rounded border border-gray-300 text-sm font-bold text-gray-800 outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-semibold flex items-center gap-1"><Clock size={12}/> New Start Time</label>
                    <input type="time" name="startTime" required value={formData.startTime} onChange={handleChange} className="w-full bg-white px-2 py-1 rounded border border-gray-300 text-sm font-bold text-gray-800 outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
            </div>

            {/* Player Info */}
            <div className="space-y-3">
                <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input type="text" name="playerName" required value={formData.playerName} onChange={handleChange} placeholder="Player Name" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <label className="text-xs text-gray-500 mb-1 block">New Price (EGP)</label>
                    <DollarSign className="absolute left-3 top-7 text-gray-400" size={14} />
                    <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg font-bold text-green-700 outline-none focus:border-green-500" />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">New Duration (Hrs)</label>
                    <input type="number" name="duration" min="1" max="6" step="0.5" required value={formData.duration} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleDelete} disabled={loading} className="flex-1 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                    Cancel
                </button>
                
                <button type="submit" disabled={loading} className="flex-[2] bg-[#111827] text-white hover:bg-black py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Update Booking
                </button>
            </div>

            </form>
        )}
      </div>
    </div>
  );
};

export default EditBookingModal;