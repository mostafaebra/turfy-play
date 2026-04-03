import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Plus,
  Loader2,
  CheckCircle,
  Inbox,
  Lock,
  MapPin,
  ChevronDown,
  Moon,
  Sun,
  ArrowDown
} from "lucide-react";

import AddOfflineBookingModal from "../../components/Schedule/AddOfflineBookingModal";
import VerifyBookingModal from "../../components/Schedule/VerifyBookingModal";
import EditBookingModal from "../../components/Schedule/EditBookingModal";
import SetPricingModal from "../../components/Schedule/SetPricingModal";
import { getOwnerFields, getFieldSchedule } from "../../services/scheduleApi";

const SchedulePage = () => {
  // Fields State
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [loadingFields, setLoadingFields] = useState(true);

  // Date State
  const todayStr = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(todayStr);
  
  // Schedule State
  const [schedule, setSchedule] = useState([]); 
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  
  // Refresh trigger state
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals State
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const isToday = currentDate === todayStr;

  // 1. Fetch Fields on Mount
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoadingFields(true);
        const response = await getOwnerFields();
        const fieldsList = response.data || response || [];
        if (Array.isArray(fieldsList) && fieldsList.length > 0) {
          setFields(fieldsList);
          setSelectedFieldId(fieldsList[0].fieldId || fieldsList[0].FieldId);
        }
      } catch (error) {
        console.error("Failed to retrieve field list:", error);
      } finally {
        setLoadingFields(false);
      }
    };
    fetchFields();
  }, []);

  // Logic: Generate 24-hour shift slots
  const generateShiftSlots = (baseDateStr, data, isTomorrow = false) => {
    const slots = [];
    const now = new Date();
    const currentRealHour = now.getHours(); 
    const todayDateObj = new Date(); todayDateObj.setHours(0,0,0,0);
    const baseDateObj = new Date(baseDateStr); baseDateObj.setHours(0,0,0,0);
    const isOldDate = baseDateObj < todayDateObj;
    const isBaseDateToday = baseDateObj.getTime() === todayDateObj.getTime();

    let startHour = parseInt((data.openingTime || data.OpeningTime)?.split(':')[0]);
    if (isNaN(startHour)) startHour = 8; 
    let endHour = parseInt((data.closingTime || data.ClosingTime)?.split(':')[0]);
    if (isNaN(endHour) || (data.closingTime === "00:00:00" && startHour !== 0)) endHour = 24;
    if (endHour <= startHour && endHour !== 0) endHour += 24;
    if (startHour === 0 && endHour === 0) endHour = 24;

    const bookings = data.bookedSlots || data.BookedSlots || [];
    const specials = data.specialSlots || data.SpecialSlots || [];

    for (let i = startHour; i < endHour; i++) {
      const displayHour = i >= 24 ? i - 24 : i;
      const isNextDayOfShift = i >= 24;
      const isPm = displayHour >= 12;
      const hour12 = displayHour > 12 ? displayHour - 12 : (displayHour === 0 || displayHour === 24 ? 12 : displayHour);
      const timeLabel = `${hour12}:00`;
      const timePrefix = displayHour.toString().padStart(2, '0');
      const fullTimeFormat = `${timePrefix}:00:00`; 
      let slotActualDate = baseDateStr;
      
      if (isNextDayOfShift) {
        const nextDate = new Date(baseDateObj);
        nextDate.setDate(nextDate.getDate() + 1);
        slotActualDate = nextDate.toISOString().split('T')[0];
      }

      let isPastHour = false;
      if (isOldDate) isPastHour = true;
      else if (isBaseDateToday) {
        if (!isNextDayOfShift && displayHour <= currentRealHour) isPastHour = true;
        if (isNextDayOfShift) {
             const isNowNextDayActual = now.getDate() !== todayDateObj.getDate();
             if (isNowNextDayActual && currentRealHour < 12 && displayHour <= currentRealHour) isPastHour = true;
        }
      }

      const booking = bookings.find(b => {
        const startStr = b.startTime || b.StartTime;
        const dateStr = b.date || b.Date;
        const bookingHour = parseInt(startStr?.split(':')[0]);
        return bookingHour === displayHour && dateStr?.split('T')[0] === slotActualDate;
      });

      const special = specials.find(s => parseInt((s.startTime || s.StartTime)?.split(':')[0]) === displayHour);
      const defPrice = data.defaultPrice ?? data.DefaultPrice;
      const currentPrice = booking ? (booking.price ?? booking.Price) : (special ? (special.price ?? special.Price) : defPrice);
      const uniqueId = isTomorrow ? `tomorrow-${i}` : `today-${i}`;

      const slotObj = {
          id: booking ? (booking.bookedSlotId || booking.BookedSlotId) : `avail-${uniqueId}`,
          time: timeLabel,
          ampm: isPm ? "PM" : "AM",
          price: currentPrice,
          realTime24: fullTimeFormat,
          actualDate: slotActualDate,
          isNextDay: isNextDayOfShift,
          isTomorrowShift: isTomorrow,
          bookingId: booking?.bookingId || booking?.BookingId
      };

      if (isPastHour) {
          slots.push({ ...slotObj, status: "closed", player: isOldDate ? "Day Passed" : "Time Passed", id: `closed-${uniqueId}` });
      } else if (booking) {
          const isOnlineRequest = booking.status === 0 || booking.status === 2 || booking.status === "Pending" || booking.status === "Online";
          slots.push({ 
            ...slotObj, 
            status: isOnlineRequest ? "booked_online" : "booked_offline", 
            player: booking.bookedBy || booking.BookedBy 
          });
      } else {
          slots.push({ ...slotObj, status: "available", player: "" });
      }
    }
    return slots;
  };

  const processBackendData = (data) => {
    if (!data) return [];
    const todaySlots = generateShiftSlots(currentDate, data, false);
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDateStr = tomorrowDate.toISOString().split('T')[0];
    const tomorrowSlots = generateShiftSlots(tomorrowDateStr, data, true);
    return [...todaySlots, { type: "separator", label: tomorrowDateStr }, ...tomorrowSlots];
  };

  // 3. Fetch Schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!selectedFieldId) return;
      try {
        setLoadingSchedule(true);
        const response = await getFieldSchedule(selectedFieldId, currentDate);
        const scheduleDto = response.data || response;
        const processedSlots = processBackendData(scheduleDto);
        setSchedule(processedSlots);
      } catch (error) {
        console.error("Error loading schedule:", error);
      } finally {
        setLoadingSchedule(false);
      }
    };
    fetchSchedule();
  }, [selectedFieldId, currentDate, refreshKey]);

  // Actions
  const changeDate = (days) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    const newDateStr = date.toISOString().split('T')[0];
    if (days < 0 && newDateStr < todayStr) return; 
    setCurrentDate(newDateStr);
  };

  const handleSlotAction = (slot) => {
    if (slot.status === 'closed' || slot.type === 'separator') return;
    setSelectedSlot(slot);
    
    if (slot.status === "available") setIsAddModalOpen(true);
    else if (slot.status === "booked_offline") setIsEditModalOpen(true);
    else if (slot.status === "booked_online") setIsVerifyModalOpen(true);
  };

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1); 
    setSelectedSlot(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Schedule</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
           <button onClick={() => setIsPricingModalOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm">
            <Edit2 size={16} /> <span>Pricing</span>
          </button>

          <div className="relative min-w-[240px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><MapPin size={18} /></div>
            <select
              value={selectedFieldId || ""}
              onChange={(e) => setSelectedFieldId(Number(e.target.value))}
              disabled={loadingFields}
              className="w-full appearance-none bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-xl pl-10 pr-10 py-2.5 shadow-sm focus:ring-2 focus:ring-[#111827]"
            >
              {loadingFields ? <option>Loading...</option> : fields.map(f => <option key={f.fieldId || f.FieldId} value={f.fieldId || f.FieldId}>{f.fieldName || f.FieldName}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown size={16} /></div>
          </div>

          <div className="flex items-center bg-white border rounded-lg shadow-sm">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-30" disabled={loadingSchedule || isToday}><ChevronLeft size={18} /></button>
            <div className="flex items-center gap-2 px-3 py-2 border-x min-w-[120px] justify-center">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm font-medium">{currentDate}</span>
            </div>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-r-lg" disabled={loadingSchedule}><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      <div className="pb-20">
        {loadingSchedule && schedule.length === 0 ? (
          <div className="flex justify-center py-20 text-gray-500"><Loader2 className="animate-spin mr-2" /> Loading...</div>
        ) : schedule.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {schedule.map((slot, index) => {
              if (slot.type === "separator") {
                  return (
                      <div key={`sep-${index}`} className="flex items-center gap-4 py-6 animate-in slide-in-from-left-4 fade-in duration-500">
                          <div className="h-px bg-indigo-200 flex-1"></div>
                          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm">
                              <Sun size={16} className="text-indigo-500" />
                              <span className="text-sm font-bold text-indigo-800">
                                  Next Day ({slot.label})
                              </span>
                              <ArrowDown size={14} className="text-indigo-400" />
                          </div>
                          <div className="h-px bg-indigo-200 flex-1"></div>
                      </div>
                  );
              }

              return (
                  <div
                  key={slot.id}
                  onClick={() => handleSlotAction(slot)}
                  className={`relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 
                      ${slot.status === "available" ? "bg-white hover:border-green-400 hover:shadow-lg cursor-pointer" : 
                      slot.status.includes("booked") ? "bg-gradient-to-r from-blue-50 to-white border-blue-200 cursor-pointer" : 
                      "bg-gray-50 opacity-70 cursor-not-allowed grayscale"}`}
                  >
                  {slot.isNextDay && !slot.isTomorrowShift && (
                      <div className="absolute top-0 right-0 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                      <Moon size={10} /> Late Night
                      </div>
                  )}
                  
                  {slot.isTomorrowShift && (
                      <div className="absolute top-0 left-0 bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-br-lg font-bold border-r border-b border-indigo-200">
                          Tomorrow
                      </div>
                  )}

                  <div className="flex items-center gap-5 pl-2">
                      <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border 
                          ${slot.isNextDay ? "bg-indigo-50 border-indigo-200 text-indigo-800" : "bg-gray-50 border-gray-200"}`}>
                      <span className="text-xl font-bold">{slot.time.split(":")[0]}</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">{slot.ampm}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                      <p className="text-base font-bold capitalize text-gray-700">
                          {slot.status === "available" ? "Available Slot" : slot.status === "closed" ? slot.player : slot.player || "Booked"}
                      </p>
                      {slot.status !== 'closed' && (
                          <p className="text-xs text-gray-500 font-mono">
                              {slot.actualDate}
                          </p>
                      )}
                      </div>
                  </div>
                  
                  {slot.status === 'available' && (
                      <div className="flex items-center gap-3">
                           <span className="text-sm font-bold text-gray-700 border px-2 py-1 rounded bg-gray-50">{slot.price} EGP</span>
                           <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-green-100 hover:text-green-600 transition-colors"><Plus size={22} /></div>
                      </div>
                  )}
                  {slot.status.includes('booked') && <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CheckCircle size={20} /></div>}
                  {slot.status === 'closed' && <div className="w-10 h-10 flex items-center justify-center text-gray-400"><Lock size={20} /></div>}
                  </div>
              );
            })}
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-xl border border-dashed"><Inbox size={40} /><p className="mt-2">No Schedule Data</p></div>
        )}
      </div>

      <AddOfflineBookingModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          slotData={selectedSlot} 
          selectedDate={selectedSlot?.actualDate || currentDate} 
          fieldId={selectedFieldId} 
          fullSchedule={schedule} 
          onSuccess={() => { setIsAddModalOpen(false); triggerRefresh(); }} 
      />
      
      <VerifyBookingModal 
          isOpen={isVerifyModalOpen} 
          onClose={() => setIsVerifyModalOpen(false)} 
          slotData={selectedSlot} 
          onSuccess={() => { setIsVerifyModalOpen(false); triggerRefresh(); }} 
      />
      
      <EditBookingModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          slotData={selectedSlot} 
          onSuccess={() => { setIsEditModalOpen(false); triggerRefresh(); }} 
      />
      
      <SetPricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
    </div>
  );
};

export default SchedulePage;