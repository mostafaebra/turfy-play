import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Added getFieldById to your API imports
import { createVoucher, getFieldById } from '../../services/voucherapi'; 

import OfferDetails from '../../components/voucher/OfferDetails';
import RepetitionRules from '../../components/voucher/RepetitionRules';
import ScheduleValidity from '../../components/voucher/ScheduleValidity';

// Import the Preview Card you provided based on your folder structure
import VenuePreviewCard from '../../components/VenuePreviewCard'; 

export default function CreateVenueOfferPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- NEW FIELD SEARCH STATES ---
  const [fieldSearchId, setFieldSearchId] = useState('');
  const [isFetchingField, setIsFetchingField] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [fieldError, setFieldError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 3, 
    discountPercentage: 20,
    maxDiscountAmount: 50,
    startDate: '',
    endDate: '',
    usageLimit: 100,
    limitPerUser: 1,
    minBookingValue: 0,
    eligibleStatus: 2,
    isRepeated: false,
    daysOfWeek: [],
    description: 'Venue Offer Discount',
    fieldId: null // <-- Added fieldId to tie the deal to the venue
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue;
    if (type === 'number' || name === 'discountPercentage' || name === 'maxDiscountAmount') {
      parsedValue = value === '' ? '' : Number(value);
    } else {
      parsedValue = value;
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleDayToggle = (dayValue) => {
    setFormData(prev => {
      const days = prev.daysOfWeek.includes(dayValue)
        ? prev.daysOfWeek.filter(d => d !== dayValue)
        : [...prev.daysOfWeek, dayValue];
      return { ...prev, daysOfWeek: days };
    });
  };

  // --- NEW: FETCH FIELD LOGIC ---
  // --- UPDATED: FETCH FIELD LOGIC ---
  const handleFetchField = async () => {
    if (!fieldSearchId) return;
    
    setIsFetchingField(true);
    setFieldError('');
    
    try {
      const res = await getFieldById(fieldSearchId);
      
      if (res.success && res.data?.isSuccess) {
        // The actual field details are inside res.data.data based on your JSON
        const apiData = res.data.data; 
        
        // Map the specific JSON keys you provided to the VenuePreviewCard format
        const mappedVenue = {
          id: fieldSearchId, // The ID you typed into the search box
          name: apiData.name || 'Unknown Field',
          location: apiData.address || 'Location Unavailable',
          // Grab the first image from the array, or use a placeholder if empty
          image: (apiData.imagesURLs && apiData.imagesURLs.length > 0) 
            ? apiData.imagesURLs[0] 
            : 'https://via.placeholder.com/400x200?text=No+Image',
          rating: apiData.totalRating || 0,
          surface: apiData.surfaceType || 'N/A',
          verified: true // Defaults to true as there is no specific field for it in the JSON
        };

        setSelectedVenue(mappedVenue);
        setFormData(prev => ({ ...prev, fieldId: mappedVenue.id }));
      } else {
        setFieldError(res.data?.message || res.message || 'Field not found.');
      }
    } catch (error) {
      setFieldError('Failed to connect to the server.');
    } finally {
      setIsFetchingField(false);
    }
  };

  const handleRemoveField = () => {
    setSelectedVenue(null);
    setFieldSearchId('');
    setFormData(prev => ({ ...prev, fieldId: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Optional: Prevent submission if no field is attached
    if (!formData.fieldId) {
      alert("Please fetch and attach a target field for this venue offer.");
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(`${formData.endDate}T23:59:59Z`).toISOString() : null,
    };

    try {
      await createVoucher(payload);
      alert('Venue Offer Published!');
      navigate('/voucher'); 
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-slate-50 min-h-screen flex flex-col text-slate-800">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500 text-white p-2 rounded-lg">
              <span className="material-icons">sports_soccer</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Turfy Play Admin</h1>
              <nav className="flex text-xs text-slate-400 gap-2 items-center">
                <span>Offers</span>
                <span>/</span>
                <span className="text-emerald-600 font-medium">Create Venue Offer</span>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Create New Venue Offer</h2>
              <p className="text-slate-500">Configure time-based discounts for specific turf fields.</p>
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                Discard
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-sm disabled:opacity-70"
              >
                {loading ? 'Publishing...' : 'Publish Offer'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              
              {/* --- NEW: TARGET VENUE SECTION --- */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <span className="p-1 bg-blue-50 text-blue-600 rounded">🏟️</span> Target Venue Field
                </h3>

                {!selectedVenue ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Search by Field ID</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="e.g., 105"
                        value={fieldSearchId}
                        onChange={(e) => setFieldSearchId(e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleFetchField}
                        disabled={isFetchingField || !fieldSearchId}
                        className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
                      >
                        {isFetchingField ? 'Searching...' : 'Fetch Field'}
                      </button>
                    </div>
                    {fieldError && <p className="text-sm text-red-500 mt-2 font-medium">{fieldError}</p>}
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <VenuePreviewCard 
                      venue={selectedVenue} 
                      onRemove={handleRemoveField} 
                    />
                  </div>
                )}
              </div>
              {/* --------------------------------- */}

              <OfferDetails formData={formData} handleChange={handleChange} />
              <RepetitionRules formData={formData} setFormData={setFormData} />
            </div>
            
            <div className="lg:col-span-5 space-y-6">
              <ScheduleValidity 
                formData={formData} 
                handleChange={handleChange} 
                handleDayToggle={handleDayToggle} 
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}