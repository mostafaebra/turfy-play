import React, { useState, useEffect } from "react";
import { X, Check, XCircle, Loader2, User, Phone, DollarSign, Calendar, Clock, ShieldCheck, Mail } from "lucide-react";
import { getOnlineBookingDetails, approveBooking, rejectBooking } from "../../../services/api";

const VerifyBookingModal = ({ isOpen, onClose, slotData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Fetch details on modal open
  useEffect(() => {
    if (isOpen && slotData?.bookingId) {
      fetchDetails(slotData.bookingId);
    }
  }, [isOpen, slotData]);

  const fetchDetails = async (id) => {
    setFetching(true);
    try {
      const response = await getOnlineBookingDetails(id);
      const data = response.data || response;
      setBookingDetails(data);
    } catch (error) {
      console.error("Failed to load details", error);
    } finally {
      setFetching(false);
    }
  };

  // Approve Booking Handler
  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await approveBooking(slotData.bookingId);
      if (res && (res.isSuccess || res.success === true)) {
        alert("✅ Booking Verified Successfully!");
        onSuccess(); 
        onClose();
      } else {
        alert("⚠️ Failed: " + (res.message || "Unknown error"));
      }
    } catch (error) {
      alert("❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  // Reject Booking Handler
  const handleReject = async () => {
    if (!window.confirm("Are you sure you want to REJECT this booking?")) return;
    
    setLoading(true);
    try {
      const res = await rejectBooking(slotData.bookingId);
      if (res && (res.isSuccess || res.success === true)) {
        alert("🚫 Booking Rejected!");
        onSuccess(); 
        onClose();
      } else {
        alert("⚠️ Failed: " + (res.message || "Unknown error"));
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
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-[#111827] flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-yellow-400" /> Verify Request
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full"><X size={18} /></button>
        </div>

        {fetching ? (
            <div className="p-10 flex flex-col items-center justify-center text-gray-500 gap-2">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p>Fetching details...</p>
            </div>
        ) : (
            <div className="p-6 space-y-6">
                
                {/* 1. Slot Details */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center border-b border-blue-200 pb-2 mb-2">
                         <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Requested Slot</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar size={16} className="text-blue-500" />
                            <span className="text-sm font-bold">{bookingDetails?.date?.split('T')[0] || slotData.actualDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Clock size={16} className="text-blue-500" />
                            <span className="text-sm font-bold">{bookingDetails?.startTime || slotData.time}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Player Information */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Player Info</label>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-1">
                            <User size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800">{bookingDetails?.playerName || "Online User"}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Mail size={12} /> {bookingDetails?.email || "No Email"}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <Phone size={18} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{bookingDetails?.phoneNumber || "No Phone"}</span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <DollarSign size={18} className="text-green-600" />
                        <span className="text-sm font-bold text-green-700">Price: {bookingDetails?.price || slotData.price} EGP</span>
                    </div>
                </div>

                {/* 3. Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                    <button onClick={handleReject} disabled={loading} className="flex-1 bg-white text-red-600 border border-red-200 hover:bg-red-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={20} />}
                        Reject
                    </button>
                    
                    <button onClick={handleApprove} disabled={loading} className="flex-[2] bg-green-600 text-white hover:bg-green-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-green-200 transition-all">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={20} />}
                        Approve Booking
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default VerifyBookingModal;