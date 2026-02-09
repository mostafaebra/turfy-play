import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Plus,
  Menu,
  Loader2,
  CheckCircle,
  DollarSign,
  Inbox,
  Clock,
  Lock,
  MapPin,       // ✅ أيقونة الموقع الجديدة
  ChevronDown   // ✅ أيقونة السهم الجديدة
} from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";

// Modal Imports
import AddOfflineBookingModal from "../../components/Schedule/Modals/AddOfflineBookingModal";
import VerifyBookingModal from "../../components/Schedule/Modals/VerifyBookingModal";
import EditBookingModal from "../../components/Schedule/Modals/EditBookingModal";
import SetPricingModal from "../../components/Schedule/Modals/SetPricingModal";

// API Service
import { getOwnerFields, getFieldSchedule } from "../../services/api";

const SchedulePage = () => {
  // --- State Management ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fields State
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [loadingFields, setLoadingFields] = useState(true);

  // Schedule State
  const todayStr = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(todayStr);
  const [schedule, setSchedule] = useState([]); 
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Modals state
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // هل اليوم المعروض هو النهاردة؟
  const isToday = currentDate === todayStr;

  // =========================================
  // 1. Fetch Fields on Load
  // =========================================
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoadingFields(true);
        const response = await getOwnerFields();
        const fieldsList = response.data || response || [];

        if (Array.isArray(fieldsList) && fieldsList.length > 0) {
          setFields(fieldsList);
          const firstId = fieldsList[0].fieldId || fieldsList[0].FieldId;
          setSelectedFieldId(firstId);
        }
      } catch (error) {
        console.error("Failed to retrieve field list:", error);
      } finally {
        setLoadingFields(false);
      }
    };

    fetchFields();
  }, []);

  // =========================================
  // 2. Process Schedule Data (اللوجيك الذكي)
  // =========================================
  const processBackendData = (data) => {
    if (!data) return [];

    const slots = [];
    const now = new Date();
    const currentRealHour = now.getHours(); 
    
    // هل التاريخ ده قديم (قبل النهاردة)؟
    const isOldDate = currentDate < todayStr; 

    // Parse Opening/Closing
    const startHour = parseInt((data.openingTime || data.OpeningTime)?.split(':')[0]) || 9; 
    let endHour = parseInt((data.closingTime || data.ClosingTime)?.split(':')[0]);
    
    if (endHour === 0 || isNaN(endHour)) endHour = 24;
    if (endHour < startHour) endHour += 24;

    const bookings = data.bookedSlots || data.BookedSlots || [];
    const specials = data.specialSlots || data.SpecialSlots || [];

    const getBookingStatus = (item) => {
      const val = item.status ?? item.Status ?? item.bookingType ?? item.BookingType;
      if (val == 1 || val === "Online") return "booked_online";
      if (val == 2 || val === "Offline") return "booked_offline";
      return "booked_offline"; 
    };

    // --- Main Loop: 24 Hours ---
    for (let i = 0; i < 24; i++) {
      const isPm = i >= 12;
      const hour12 = i > 12 ? i - 12 : (i === 0 || i === 24 ? 12 : i);
      const timeLabel = `${hour12}:00`;
      const timePrefix = i.toString().padStart(2, '0'); 
      const fullTimeFormat = `${timePrefix}:00:00`;

      // 🛑 منطق الحماية من الماضي 🛑
      const isPastHour = isOldDate || (isToday && i <= currentRealHour);

      // Check Open/Closed Normally
      let isOpen = false;
      if (endHour > 24) { 
         isOpen = (i >= startHour);
      } else {
         isOpen = i >= startHour && i < endHour;
      }

      // -- Closed / Past Slot --
      if (!isOpen || isPastHour) {
        slots.push({
          id: `closed-${i}`,
          time: timeLabel,
          ampm: isPm ? "PM" : "AM",
          status: "closed", 
          price: "-",
          player: isOldDate ? "Day Passed" : (isPastHour ? "Time Passed" : "Closed"), 
        });
        continue; 
      }

      // -- Open Slot: Search for Booking --
      const booking = bookings.find(b => {
        const startStr = b.startTime || b.StartTime;
        const dateStr = b.date || b.Date;
        const bookingHour = parseInt(startStr?.split(':')[0]);
        const bookingDate = dateStr?.split('T')[0];
        return bookingHour === i && bookingDate === currentDate;
      });

      const special = specials.find(s => {
        const sStart = s.startTime || s.StartTime;
        return parseInt(sStart?.split(':')[0]) === i;
      });

      const defPrice = data.defaultPrice ?? data.DefaultPrice;
      const bPrice = booking ? (booking.price ?? booking.Price) : null;
      const sPrice = special ? (special.price ?? special.Price) : null;
      const currentPrice = bPrice || sPrice || defPrice;

      if (booking) {
        slots.push({
          id: booking.bookedSlotId || booking.BookedSlotId,
          time: timeLabel,
          ampm: isPm ? "PM" : "AM",
          status: getBookingStatus(booking), 
          price: currentPrice, 
          player: booking.bookedBy || booking.BookedBy || "Unknown",
          bookingId: booking.bookingId || booking.BookingId
        });
      } else {
        slots.push({
          id: `avail-${i}`,
          time: timeLabel,
          ampm: isPm ? "PM" : "AM",
          status: "available",
          price: currentPrice, 
          player: "",
          realTime24: fullTimeFormat 
        });
      }
    }
    return slots;
  };

  // =========================================
  // 3. Fetch Schedule
  // =========================================
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedFieldId) return;

      try {
        setLoadingSchedule(true);
        setSchedule([]); 
        
        const response = await getFieldSchedule(selectedFieldId, currentDate);
        const scheduleDto = response.data || response;
        const processedSlots = processBackendData(scheduleDto);
        setSchedule(processedSlots);
      } catch (error) {
        console.error("Error loading schedule:", error);
        setSchedule([]);
      } finally {
        setLoadingSchedule(false);
      }
    };

    fetchSchedule();
  }, [selectedFieldId, currentDate]);


  // =========================================
  // 4. Handlers
  // =========================================
  const changeDate = (days) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    const newDateStr = date.toISOString().split('T')[0];

    // حماية: ممنوع الرجوع للماضي
    if (days < 0 && newDateStr < todayStr) return;

    setCurrentDate(newDateStr);
  };

  const handleSlotAction = (slot) => {
    if (slot.status === 'closed') return;

    if (slot.status === "available") {
      setSelectedSlot(slot);
      setIsAddModalOpen(true);
    } else if (slot.status === "booked_offline") {
      setSelectedSlot(slot);
      setIsEditModalOpen(true); 
    } else if (slot.status === "booked_online") {
      setSelectedSlot(slot);
      setIsVerifyModalOpen(true); 
    }
  };

  const handleManualAdd = () => {
    setSelectedSlot(null); 
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white border rounded-lg text-gray-600 md:hidden hover:bg-gray-50">
              <Menu size={20} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Schedule Management</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
            <button onClick={() => setIsPricingModalOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm transition-all flex-grow md:flex-grow-0 justify-center">
              <Edit2 size={16} />
              <span>Edit Pricing</span>
            </button>

            {/* 🔥🔥🔥🔥 Field Select - تصميم جديد مودرن 🔥🔥🔥🔥 */}
            <div className="relative flex-grow md:flex-grow-0 min-w-[240px]">
              {/* Left Icon (Map Marker) */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <MapPin size={18} />
              </div>

              {/* The Select Input */}
              <select
                value={selectedFieldId || ""}
                onChange={(e) => setSelectedFieldId(Number(e.target.value))}
                disabled={loadingFields}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-xl pl-10 pr-10 py-2.5 shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent 
                hover:border-gray-300 transition-all cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
              >
                {loadingFields ? (
                  <option>Loading Fields...</option>
                ) : fields.length > 0 ? (
                  fields.map((field) => (
                    <option key={field.fieldId || field.FieldId} value={field.fieldId || field.FieldId}>
                      {field.fieldName || field.FieldName}
                    </option>
                  ))
                ) : (
                  <option>No Fields Found</option>
                )}
              </select>

              {/* Right Icon (Custom Chevron) */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={16} strokeWidth={2.5} />
              </div>
            </div>
            {/* 🔥🔥🔥🔥 نهاية التصميم الجديد 🔥🔥🔥🔥 */}

            {/* Date Navigator */}
            <div className="flex items-center bg-white border rounded-lg shadow-sm flex-grow md:flex-grow-0 justify-center">
              <button 
                onClick={() => changeDate(-1)} 
                className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={loadingSchedule || isToday}
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-2 px-3 py-2 border-x min-w-[120px] justify-center">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm font-medium tracking-wide">{currentDate}</span>
              </div>

              <button 
                onClick={() => changeDate(1)} 
                className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingSchedule}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 md:gap-6 items-center border border-gray-100 text-xs md:text-sm">
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-200"></span><span className="text-gray-600">Online (Paid)</span></div>
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-200"></span><span className="text-gray-600">Offline (Cash)</span></div>
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border border-gray-300 bg-gray-50"></span><span className="text-gray-600">Available</span></div>
           <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-300"></span><span className="text-gray-500">Closed/Past</span></div>
        </div>

        {/* Schedule Grid */}
        <div className="pb-20">
          {loadingSchedule ? (
            <div className="flex justify-center items-center py-20 text-gray-500">
                <Loader2 className="animate-spin mr-2" /> Loading Schedule...
            </div>
          ) : schedule.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {schedule.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => handleSlotAction(slot)}
                  className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 overflow-hidden
                    ${
                      slot.status === "available"
                        ? "bg-white border-gray-100 hover:border-green-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                        : slot.status === "booked_online"
                        ? "bg-gradient-to-r from-green-50 to-white border-green-200 cursor-pointer"
                        : slot.status === "booked_offline"
                        ? "bg-gradient-to-r from-blue-50 to-white border-blue-200 cursor-pointer"
                        : "bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed grayscale"
                    }`}
                >
                  {/* Status Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 
                    ${slot.status === 'available' ? 'bg-transparent group-hover:bg-green-400' : 
                      slot.status === 'booked_online' ? 'bg-green-500' : 
                      slot.status === 'booked_offline' ? 'bg-blue-500' : 'bg-gray-400'
                    } transition-colors duration-300`}>
                  </div>

                  {/* Slot Info */}
                  <div className="flex items-center gap-5 pl-2">
                    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border 
                      ${slot.status === 'closed' 
                        ? 'bg-gray-200 text-gray-400 border-gray-300' 
                        : slot.status === 'available' 
                        ? 'bg-gray-50 border-gray-200 text-gray-700 group-hover:bg-green-50 group-hover:border-green-200' 
                        : 'bg-white/80 border-transparent shadow-sm'
                      }`}>
                      <span className="text-xl font-bold leading-none tracking-tight">
                        {slot.time.split(":")[0]}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 mt-1">
                        {slot.ampm}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className={`text-base font-bold capitalize 
                        ${slot.status === 'closed' ? 'text-gray-500' :
                          slot.status === 'available' ? 'text-gray-700 group-hover:text-green-700' : 
                          slot.status === 'booked_online' ? 'text-green-800' : 'text-blue-800'
                        } transition-colors`}>
                        {slot.status === "available" ? "Available Slot" : 
                         slot.status === "closed" ? slot.player : slot.player || "Booked"}
                      </p>
                      
                      {slot.status !== 'closed' && (
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 bg-gray-50 w-fit px-2 py-0.5 rounded-md border border-gray-100">
                          <DollarSign size={14} className="text-gray-400" />
                          <span className="tracking-wide text-gray-700 font-semibold">{slot.price} EGP</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Icon */}
                  {slot.status !== 'closed' ? (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                      ${slot.status === "available"
                        ? "bg-gray-100 text-gray-400 group-hover:bg-green-600 group-hover:text-white group-hover:rotate-90"
                        : slot.status === "booked_online"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                      }`}>
                      {slot.status === "available" ? <Plus size={22} /> : 
                       slot.status === "booked_online" ? <CheckCircle size={20} /> : <DollarSign size={20} />}
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center text-gray-400 opacity-50">
                        {slot.player.includes("Passed") ? <Clock size={20}/> : <Lock size={20} />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Inbox size={40} className="text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-700">No Schedule Data</p>
                <p className="text-sm text-gray-400 mb-6 text-center">
                    Could not load schedule for this day.
                </p>
                <button 
                  onClick={handleManualAdd}
                  className="px-5 py-2.5 bg-[#111827] text-white rounded-lg hover:bg-[#0f172a] transition-all flex items-center gap-2 shadow-sm font-medium"
                >
                  <Plus size={18} />
                  Add First Booking
                </button>
            </div>
          )}
        </div>

        {/* Modals Injection */}
        <SetPricingModal 
            isOpen={isPricingModalOpen} 
            onClose={() => setIsPricingModalOpen(false)} 
        />
        
        <AddOfflineBookingModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            slotData={selectedSlot} 
            selectedDate={currentDate}
            fieldId={selectedFieldId} 
            fullSchedule={schedule} 
            onSuccess={() => {
                window.location.reload(); 
            }} 
        />
        
        <VerifyBookingModal 
            isOpen={isVerifyModalOpen} 
            onClose={() => setIsVerifyModalOpen(false)} 
            slotData={selectedSlot} 
        />
        <EditBookingModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            slotData={selectedSlot} 
        />
      </div>
    </div>
  );
};

export default SchedulePage;