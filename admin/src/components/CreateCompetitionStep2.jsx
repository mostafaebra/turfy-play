import React, { useState, useEffect, useRef } from 'react';
import VenuePreviewCard from './VenuePreviewCard';
// We import the service function here. 
// Make sure the path matches where you saved 'apiservices.js'
import { getFieldById } from '../services/apiservices'; 
import { 
  MdCalendarMonth, MdSearch, MdArrowForward, MdArrowBack, MdAdd, MdError, MdCheckCircle, MdEventBusy 
} from 'react-icons/md';

const CreateCompetitionStep2 = ({ onNext, onBack, competitionData }) => {
  const [formData, setFormData] = useState({ startDate: '', endDate: '', deadlineDate: '' });
  const [currentInputId, setCurrentInputId] = useState('');
  const [addedVenues, setAddedVenues] = useState([]); 
  const [isLoadingVenue, setIsLoadingVenue] = useState(false);
  const [toast, setToast] = useState(null); 

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const deadlineRef = useRef(null);
  const fieldInputRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const getMinStartDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7); 
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (competitionData) {
        setFormData(prev => ({
            ...prev,
            startDate: competitionData.startDate || '',
            endDate: competitionData.endDate || '',
            deadlineDate: competitionData.deadlineDate || ''
        }));
        if (competitionData.addedVenues) setAddedVenues(competitionData.addedVenues);
    }
  }, [competitionData]);

  // ⚡️ UPDATED: Uses Real API Endpoint
  const handleAddField = async () => {
    if (!currentInputId) { fieldInputRef.current?.focus(); return; }
    
    // Check local duplicates first
    if (addedVenues.some(v => v.id === currentInputId)) { 
        showToast('error', 'This field is already added!'); 
        return; 
    }

    setIsLoadingVenue(true);
    
    try {
        // 1. Call the API Service
        const response = await getFieldById(currentInputId);

        // 2. Check if API call was successful
        if (response.success && response.data && response.data.isSuccess) {
            
            // 3. Extract the actual data object from the response body
            // Based on your screenshot: { data: { name: "...", ... } }
            const fieldData = response.data.data;

            if (fieldData) {
                const newVenue = {
                    id: currentInputId,
                    name: fieldData.name || 'Unnamed Field',
                    location: fieldData.address || 'Unknown Location',
                    // Use the first image if available, else a nice placeholder
                    image: (fieldData.imagesURLs && fieldData.imagesURLs.length > 0) 
                            ? fieldData.imagesURLs[0] 
                            : 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=1000',
                    rating: fieldData.totalRating || 0,
                    // Map surfaceType (3) to text if possible, or use fieldSize
                    surface: fieldData.fieldSize || 'Standard', 
                    verified: true
                };

                setAddedVenues(prev => [...prev, newVenue]);
                showToast('success', 'Venue found and added!');
                setCurrentInputId(''); 
            } else {
                showToast('error', 'Field data is empty.');
            }

        } else {
            // API returned logic error (e.g. ID not found)
            const errorMsg = response.message || (response.data ? response.data.message : 'Field ID not found');
            showToast('error', errorMsg || 'Field not found');
        }

    } catch (error) {
        console.error("API Error:", error);
        showToast('error', 'Connection failed. Please try again.');
    } finally {
        setIsLoadingVenue(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.startDate) { showToast('error', 'Start Date required'); return; }
    if (!formData.endDate) { showToast('error', 'End Date required'); return; }
    if (addedVenues.length === 0) { showToast('error', 'Please add at least one field'); return; }
    onNext({ ...formData, addedVenues });
  };

  return (
    <div className="relative">
      {toast && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${toast.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {toast.type === 'error' ? <MdError size={20} /> : <MdCheckCircle size={20} />}
            <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-2 ring-emerald-500/20">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <MdCalendarMonth className="text-emerald-500" size={20} />
            <span className="hidden sm:inline">Schedule & Location</span>
            <span className="sm:hidden">Schedule</span>
            </h3>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Step 2</span>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            
            {/* 📱 RESPONSIVE DATES GRID */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Tournament Dates <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* START DATE Styled Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500">
                            <MdCalendarMonth size={20} />
                        </div>
                        <input 
                            ref={startDateRef}
                            type="date"
                            min={getMinStartDate()}
                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 bg-white shadow-sm transition-all cursor-pointer"
                            value={formData.startDate}
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        />
                         <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-emerald-600 font-bold hidden group-focus-within:block">Start</span>
                    </div>

                    {/* END DATE Styled Input */}
                    <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                            <MdCalendarMonth size={20} />
                        </div>
                        <input 
                            ref={endDateRef}
                            type="date" 
                            min={formData.startDate}
                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 bg-white shadow-sm transition-all cursor-pointer"
                            value={formData.endDate}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DEADLINE Styled Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Deadline <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-400">
                            <MdEventBusy size={20} />
                        </div>
                        <input 
                            ref={deadlineRef}
                            type="date" 
                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 bg-white shadow-sm"
                            value={formData.deadlineDate}
                            onChange={(e) => setFormData({...formData, deadlineDate: e.target.value})}
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">At least 24h before start</p>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Assigned Fields <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                        <div className="relative group flex-1">
                            <input 
                                ref={fieldInputRef}
                                type="number" 
                                placeholder="Enter Field ID (e.g. 2)" 
                                className="w-full h-12 pl-4 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
                                value={currentInputId}
                                onChange={(e) => setCurrentInputId(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
                            />
                        </div>
                        <button 
                            onClick={handleAddField}
                            disabled={isLoadingVenue}
                            className="bg-emerald-500 text-white px-4 rounded-xl font-bold hover:bg-emerald-600 transition flex items-center justify-center shadow-sm shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoadingVenue ? (
                                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <MdAdd size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Added Venues List */}
            {addedVenues.length > 0 && (
                <div className="mt-4 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-bottom-2 fade-in">
                     <div className="grid grid-cols-1 gap-3">
                        {addedVenues.map((venue) => (
                            <VenuePreviewCard 
                                key={venue.id} 
                                venue={venue} 
                                onRemove={(id) => setAddedVenues(prev => prev.filter(v => v.id !== id))} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
            <button onClick={onBack} className="flex items-center justify-center gap-2 text-slate-600 font-medium hover:text-slate-900 text-sm sm:text-base px-4 py-2.5 rounded-lg hover:bg-slate-100 transition-colors">
                <MdArrowBack size={18} /> Back
            </button>
            <button onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2.5 rounded-lg font-bold shadow-sm flex items-center justify-center gap-2 transition-all text-sm sm:text-base w-full sm:w-auto">
                Next Step <MdArrowForward size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCompetitionStep2;