import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { bookingApi } from '../../services/bookingApi';
import { Calendar as CalendarIcon, ChevronDown, AlertCircle, CheckCircle, X } from 'lucide-react';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // STATE
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fieldData, setFieldData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null); 
    
    // SELECTION STATE
    const [selectionMode, setSelectionMode] = useState('duration'); 
    const [duration, setDuration] = useState(1); 
    const [startSlot, setStartSlot] = useState(null);
    const [endSlot, setEndSlot] = useState(null);

    // HELPER
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // FETCH DATA
    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setLoading(true);
            setFieldData(null); 
            
            try {
                const dateStr = formatDate(selectedDate);
                const res = await bookingApi.getFieldAvailability(id, dateStr);
                
                if (res && res.isSuccess !== false) {
                     setFieldData(res.data || res);
                } else {
                     showToast("Failed to load availability.", "error");
                }
            } catch (err) {
                console.error("Failed to load field data", err);
                showToast("Network error. Please try again.", "error");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, selectedDate]);

    // RESET SELECTION
    useEffect(() => {
        setStartSlot(null);
        setEndSlot(null);
    }, [selectedDate]);

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // GENERATE SLOTS
    const timeSlots = useMemo(() => {
        if (!fieldData) return [];
        
        const slots = [];
        const now = new Date();
        const toDateString = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const targetDateStr = toDateString(selectedDate);
        const todayStr = toDateString(now);
        const isToday = targetDateStr === todayStr;

        const startTime = fieldData.startTime || "08:00:00";
        const endTime = fieldData.endTime || "23:00:00";
        const bookedSlots = fieldData.bookedSlots || [];
        const specialSlots = fieldData.specialSlots || [];
        const defaultPrice = fieldData.hourlyPrice || fieldData.price || fieldData.Price || 0;

        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
                const isOperating = timeStr >= startTime && timeStr < endTime;

                const isBooked = bookedSlots.some(s => {
                    const slotDateOnly = s.slotDate.split('T')[0];
                    return slotDateOnly === targetDateStr && s.startTime === timeStr;
                });

                const special = specialSlots.find(s => {
                    const slotDateOnly = s.slotDate.split('T')[0];
                    return slotDateOnly === targetDateStr && timeStr >= s.startTime && timeStr < s.endTime;
                });

                // Passed Time Check
                let isPassed = false;
                if (isToday) {
                    const slotDateTime = new Date(`${targetDateStr}T${timeStr}`);
                    if (slotDateTime < now) {
                        isPassed = true;
                    }
                }

                const timestamp = new Date(`${targetDateStr}T${timeStr}`).getTime();

                if (isOperating) {
                    slots.push({
                        id: timestamp,
                        date: targetDateStr,
                        time: timeStr.substring(0, 5),
                        isAvailable: !isBooked && !isPassed,
                        price: special ? special.specialPrice : defaultPrice,
                        isSpecial: !!special
                    });
                }
            }
        }
        return slots;
    }, [fieldData, selectedDate]);

    // UI COMPONENTS
    const isSlotSelectable = (slot) => {
        if (!slot.isAvailable) return false;
        if (selectionMode === 'duration') {
            const slotsNeeded = duration === 1 ? 2 : duration === 2 ? 3 : duration === 3 ? 4 : duration === 4 ? 5 : 6;
            const startIndex = timeSlots.findIndex(s => s.id === slot.id);
            if (startIndex === -1 || startIndex + slotsNeeded > timeSlots.length) return false;
            for (let i = 0; i < slotsNeeded; i++) {
                if (!timeSlots[startIndex + i].isAvailable) return false;
            }
        }
        return true;
    };

    const handleSlotClick = (slot) => {
        if (!isSlotSelectable(slot)) {
            showToast("Slot unavailable or insufficient time.", "error");
            return;
        }
        if (selectionMode === 'duration') {
            setStartSlot(slot);
            setEndSlot(null);
        } else {
            if (!startSlot || (startSlot && endSlot)) {
                setStartSlot(slot);
                setEndSlot(null);
            } else {
                if (slot.id < startSlot.id) {
                    setStartSlot(slot);
                    setEndSlot(null);
                } else {
                    const startIndex = timeSlots.findIndex(s => s.id === startSlot.id);
                    const endIndex = timeSlots.findIndex(s => s.id === slot.id);
                    let hasOverlap = false;
                    for(let i = startIndex; i <= endIndex; i++) {
                        if (!timeSlots[i].isAvailable) { hasOverlap = true; break; }
                    }
                    if (hasOverlap) {
                        showToast("Range overlaps with existing booking.", "error");
                        setStartSlot(null); setEndSlot(null);
                    } else {
                        setEndSlot(slot);
                    }
                }
            }
        }
    };

    const handleCheckout = () => {
        if (!startSlot || (selectionMode === 'range' && !endSlot)) {
            showToast("Please select a complete time slot or range.", "error");
            return;
        }
        
        // Calculate totals for checkout
        let hours = 0;
        let basePrice = 0;
        const slotPrice = startSlot.price;

        if (selectionMode === 'duration') {
            hours = duration === 1 ? 1 : duration === 2 ? 1.5 : duration === 3 ? 2 : duration === 4 ? 2.5 : 3;
            basePrice = slotPrice * hours;
        } else if (endSlot) {
            const diff = (endSlot.id - startSlot.id) / (1000 * 60 * 60);
            hours = diff + 0.5;
            basePrice = slotPrice * hours;
        } else {
            hours = 0.5;
            basePrice = slotPrice * 0.5;
        }

        const serviceFeePercentage = fieldData.serviceFeePercentage || 0.05;
        const serviceFee = basePrice * (serviceFeePercentage / 100);
        const total = basePrice + serviceFee;

        const bookingDetails = {
            fieldId: id,
            fieldName: fieldData.name,
            bookingDate: startSlot.date,
            bookingTime: startSlot.time,
            bookingDuration: selectionMode === 'duration' ? duration : 1, // simplified
            basePrice: basePrice,
            serviceFee: serviceFee,
            totalPrice: total,
            image: fieldData.imageUrl
        };
        navigate('/payment', { state: { bookingDetails } });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-600 font-bold animate-pulse">Loading schedule...</div>;
    if (!fieldData) return <div className="min-h-screen flex justify-center items-center">Data Unavailable</div>;

    return (
        <main className="min-h-screen bg-gray-50 flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8 relative">
            {toast && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transition-all ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'} text-white`}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="font-medium text-sm">{toast.message}</p>
                    <button onClick={() => setToast(null)} className="ml-2 opacity-80 hover:opacity-100"><X size={18} /></button>
                </div>
            )}

            <div className="flex flex-col w-full max-w-4xl">
                <div className="mb-6">
                    <button onClick={() => navigate(`/details/${id}`)} className="text-slate-500 hover:text-slate-800 mb-2 flex items-center gap-1 text-sm font-medium">← Back to Details</button>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-3xl font-black tracking-tighter text-slate-900">Book {fieldData.name}</h1>
                        <div className="relative z-20">
                            <DatePicker 
                                selected={selectedDate} 
                                onChange={(date) => setSelectedDate(date)} 
                                dateFormat="MMMM d, yyyy"
                                minDate={new Date()}
                                customInput={
                                    <button className="flex items-center gap-2 bg-white border border-gray-300 hover:border-emerald-500 text-slate-700 font-semibold py-2.5 px-4 rounded-lg shadow-sm">
                                        <CalendarIcon size={18} className="text-emerald-600" />
                                        <span>{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        <ChevronDown size={16} className="text-gray-400" />
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Field Header */}
                        <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-32">
                            <div className="w-full md:w-1/3 bg-center bg-cover h-32 md:h-full" style={{backgroundImage: `url(${fieldData.imageUrl || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=1000'})`}}></div>
                            <div className="p-4 flex flex-col justify-center flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{fieldData.name}</h3>
                                        <p className="text-sm text-slate-500">{fieldData.address}</p>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                                        ★ {typeof fieldData.rating === 'object' ? (fieldData.totalRating || "N/A") : (fieldData.rating || "New")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Slot Picker */}
                        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 pb-4 border-b border-gray-100">
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button onClick={() => setSelectionMode('duration')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${selectionMode === 'duration' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Fixed Duration</button>
                                    <button onClick={() => setSelectionMode('range')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${selectionMode === 'range' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Start & End</button>
                                </div>
                                {selectionMode === 'duration' && (
                                    <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="rounded-lg border border-gray-300 bg-gray-50 h-10 px-3 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none">
                                        <option value={1}>1 hour</option>
                                        <option value={2}>1.5 hours</option>
                                        <option value={3}>2 hours</option>
                                        <option value={4}>2.5 hours</option>
                                        <option value={5}>3 hours</option>
                                    </select>
                                )}
                            </div>
                            <div className="relative">
                                <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Available Slots (Scroll Down)</div>
                                <div className="max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                    <div className="grid grid-cols-3 gap-3">
                                        {timeSlots.length > 0 ? timeSlots.map((slot) => {
                                            const active = (startSlot && slot.id === startSlot.id) || (startSlot && endSlot && slot.id >= startSlot.id && slot.id <= endSlot.id);
                                            const isEndpoint = slot.id === startSlot?.id || (selectionMode === 'range' && slot.id === endSlot?.id);
                                            const selectable = isSlotSelectable(slot);
                                            return (
                                                <button
                                                    key={slot.id}
                                                    disabled={!selectable} 
                                                    onClick={() => handleSlotClick(slot)}
                                                    className={`relative py-3 rounded-lg text-sm font-semibold border transition-all flex flex-col items-center justify-center ${!selectable ? 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed opacity-60' : active ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500' : 'border-gray-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'} ${isEndpoint ? 'bg-emerald-600 !text-white !border-emerald-600 shadow-md' : ''}`}
                                                >
                                                    <span>{slot.time}</span>
                                                    {slot.isSpecial && selectable && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-yellow-400 m-1"></span>}
                                                </button>
                                            );
                                        }) : <div className="col-span-3 text-center text-gray-400 py-4">No slots available</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1 sticky top-24">
                        <div className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4 bg-white shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">Summary</h2>
                            <div className="flex flex-col gap-3 text-sm pt-2 text-slate-600">
                                <div className="flex justify-between">
                                    <p>Time</p>
                                    <p className="font-semibold text-right text-slate-900">{startSlot ? `${startSlot.time}` : '--:--'}</p>
                                </div>
                                <div className="w-full h-px bg-gray-200 my-2"></div>
                                <button 
                                    onClick={handleCheckout}
                                    disabled={!startSlot || (selectionMode === 'range' && !endSlot)}
                                    className={`w-full h-12 mt-4 rounded-lg font-bold transition-all shadow-lg ${startSlot && (selectionMode !== 'range' || endSlot) ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    Proceed to Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BookingPage;