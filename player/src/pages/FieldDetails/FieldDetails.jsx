import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// --- FIX: Import the API service ---
import { getFieldDetails } from "../../services/bookingApi";

// Icons
import {
  MapPin, Star, ChevronLeft, ArrowLeft, Zap, Car,
  Armchair, Waves, ShieldCheck, Clock, Shirt,
  CircleDashed, ChevronRight
} from "lucide-react";

// --- UTILITY HELPER ---
const getFacilitiesList = (facilities) => {
  if (!facilities) return [];
  if (Array.isArray(facilities) && typeof facilities[0] === 'string') return facilities;
  if (Array.isArray(facilities) && typeof facilities[0] === 'object') {
    return facilities.map(f => f.name || f.Name || "Unknown Facility");
  }
  return [];
};

// --- CONSTANTS ---
const AMENITY_ICONS = {
  "Professional Lighting": { icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
  "Changing Rooms": { icon: Shirt, color: "text-purple-600", bg: "bg-purple-50" },
  Showers: { icon: Waves, color: "text-cyan-600", bg: "bg-cyan-50" },
  "Secure Parking": { icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
  "Ball Rental": { icon: CircleDashed, color: "text-orange-600", bg: "bg-orange-50" },
  "Spectator Seating": { icon: Armchair, color: "text-indigo-600", bg: "bg-indigo-50" },
  "Default": { icon: ShieldCheck, color: "text-gray-600", bg: "bg-gray-100" }
};

const CANCELLATION_POLICIES = {
  1: {
    title: "Flexible Cancellation",
    desc: "You can cancel up to 24 hours before for a full refund.",
    color: "text-green-700", bg: "bg-green-50", border: "border-green-200", iconColor: "text-green-600",
  },
  2: {
    title: "Moderate Policy",
    desc: "50% refund for cancellations made 24 hours prior. No refund within 24h.",
    color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", iconColor: "text-orange-600",
  },
  3: {
    title: "Strict Policy",
    desc: "Non-refundable. Booking cannot be cancelled or rescheduled.",
    color: "text-red-700", bg: "bg-red-50", border: "border-red-200", iconColor: "text-red-600",
  },
};

const FieldDetails = () => {
  // --- HOOKS ---
  const navigate = useNavigate();
  const { id } = useParams(); 

  // Refs for Scroll Spy
  const refs = {
    description: useRef(null),
    amenities: useRef(null),
    reviews: useRef(null),
    location: useRef(null),
    policy: useRef(null),
    calendar: useRef(null)
  };

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("description");
  const [fieldData, setFieldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  // Touch State for Swiping
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // --- 1. FETCH DATA (Updated to use API Service) ---
  useEffect(() => {
    const fetchField = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);

        // Call the centralized API function
        const result = await getFieldDetails(id);

        if (result.isSuccess === true && result.data) {
             setFieldData(result.data);
        } else if (result.isSuccess === false) {
             throw new Error(result.message || "Failed to load field details");
        } else {
             // Fallback for different API structures
             setFieldData(result.data || result);
        }

      } catch (err) {
        console.error("Fetch Details Error:", err);
        setError(err.message || "Error loading field details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchField();
  }, [id]);

  // --- 2. SCROLL SPY LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250; 

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        setActiveTab("policy");
        return;
      }

      if (refs.policy.current && scrollPosition >= refs.policy.current.offsetTop) setActiveTab("policy");
      else if (refs.location.current && scrollPosition >= refs.location.current.offsetTop) setActiveTab("location");
      else if (refs.reviews.current && scrollPosition >= refs.reviews.current.offsetTop) setActiveTab("reviews");
      else if (refs.amenities.current && scrollPosition >= refs.amenities.current.offsetTop) setActiveTab("amenities");
      else if (refs.description.current && scrollPosition >= refs.description.current.offsetTop) setActiveTab("description");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HANDLERS ---
  const scrollToSection = (refName) => {
    const ref = refs[refName];
    if(ref && ref.current) {
        window.scrollTo({ top: ref.current.offsetTop - 120, behavior: "smooth" });
    }
  };

  const minSwipeDistance = 50;
  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  const displayImages = (fieldData?.imagesURLs && fieldData.imagesURLs.length > 0) 
    ? fieldData.imagesURLs 
    : [
        "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2070",
        "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=2070"
      ];

  const nextImage = () => setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star key={index} size={14} className={`${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ));
  };

  const getMaxDate = () => {
    if (!fieldData) return null;
    const daysToAdd = fieldData.availableDays ? parseInt(fieldData.availableDays, 10) : 30;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + daysToAdd);
    return maxDate;
  };

  const handleBooking = () => {
    const currentId = id || fieldData?.id;
    if (!currentId) return;
    
    // Pass selected date to BookingPage via state
    // Note: BookingPage needs to be updated to read this state if it doesn't already
    navigate(`/booking/${currentId}`, { 
        state: { 
            preSelectedDate: selectedDate 
        } 
    });
  };

  const handleMobileAction = () => {
    if (selectedDate) {
      handleBooking();
    } else {
      if (refs.calendar.current) {
        refs.calendar.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // --- LOADING / ERROR STATES ---
  if (loading) return (
    <div className="h-screen flex flex-col justify-center items-center gap-4 bg-gray-50">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 font-medium">Loading Field Details...</p>
    </div>
  );
  
  if (error || !fieldData) return (
    <div className="h-screen flex flex-col justify-center items-center gap-4 bg-gray-50 px-4 text-center">
      <div className="bg-red-50 p-4 rounded-full text-red-500"><ShieldCheck size={48} /></div>
      <h3 className="text-xl font-bold text-gray-800">Something went wrong</h3>
      <p className="text-gray-500 max-w-md">{error || "We couldn't find the field you're looking for."}</p>
      <button onClick={() => navigate('/')} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition">
        Go Home
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* === HERO SECTION === */}
      <div className="relative h-[400px] w-full group overflow-hidden bg-gray-900" 
           onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        
        {/* Main Image */}
        <img 
            src={displayImages[currentImageIndex]} 
            alt={fieldData?.name || "Field"} 
            className="w-full h-full object-cover transition-opacity duration-500 opacity-90" 
        />
        
        {/* Back Button */}
        <button onClick={() => navigate('/')} className="absolute top-4 left-4 p-3 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition z-20">
          <ArrowLeft size={20} />
        </button>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        
        {/* Desktop Nav Arrows */}
        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-white/20 transition hidden md:block">
            <ChevronLeft size={24} />
        </button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-white/20 transition hidden md:block">
            <ChevronRight size={24} />
        </button>

        {/* Hero Text */}
        <div ref={refs.description} className="absolute bottom-0 left-0 w-full p-4 pb-12 md:p-8 z-10">
          <div className="container mx-auto">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Star fill="currentColor" size={18} />
                <span className="text-white font-bold">{fieldData?.totalRating || "New"}</span>
                <span className="text-gray-300 text-sm">({fieldData?.reviewsCount || 0} reviews)</span>
              </div>
              <h1 className="text-2xl md:text-5xl font-bold text-white leading-tight">
                {fieldData?.name || "Unnamed Field"}
              </h1>
              <div className="flex items-center gap-2 text-gray-300 text-sm md:text-lg">
                <MapPin size={18} className="text-green-400" /> 
                <span>{fieldData?.address || "Address not provided"}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {displayImages.map((_, index) => (
            <div key={index} className={`h-1.5 rounded-full transition-all ${index === currentImageIndex ? "bg-white w-6" : "bg-white/40 w-1.5"}`}></div>
          ))}
        </div>
      </div>

      {/* === CONTENT GRID === */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Sticky Navigation Tabs */}
            <div className="sticky top-0 z-30 bg-gray-50 pt-2 pb-1 mb-8">
              <div className="flex items-center gap-6 border-b border-gray-200 text-gray-500 font-medium pb-px overflow-x-auto no-scrollbar">
                {["description", "amenities", "reviews", "location", "policy"].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => scrollToSection(tab)} 
                    className={`capitalize whitespace-nowrap pb-3 text-sm md:text-base transition-colors border-b-2 ${activeTab === tab ? "text-green-600 border-green-600 font-bold" : "border-transparent hover:text-green-600"}`}
                  >
                    {tab === "reviews" ? `Reviews (${fieldData.reviewsCount || 0})` : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <section className="animate-fade-in">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">About this venue</h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to <span className="font-bold text-gray-900">{fieldData?.name}</span>. 
                Experience a top-tier game on our <span className="font-bold text-green-600">{fieldData?.surfaceType || "Professional"}</span> surface. 
                Ideally suited for <span className="font-bold text-blue-600">{fieldData?.fieldSize || "Standard"}</span> matches.
              </p>
            </section>

            {/* Amenities */}
            <section ref={refs.amenities} className="border-t border-gray-200 pt-8 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              {getFacilitiesList(fieldData?.facilities).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {getFacilitiesList(fieldData.facilities).map((amenityName, index) => {
                    const config = AMENITY_ICONS[amenityName] || AMENITY_ICONS["Default"];
                    const TheIcon = config.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
                        <div className={`p-2 rounded-full ${config.bg} ${config.color}`}>
                            <TheIcon size={18} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{amenityName}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">No specific amenities listed.</p>
              )}
            </section>

            {/* Reviews */}
            <section ref={refs.reviews} className="border-t border-gray-200 pt-8 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
              {fieldData?.rating && fieldData.rating.length > 0 ? (
                <div className="space-y-6">
                  {(showAllReviews ? fieldData.rating : fieldData.rating.slice(0, 3)).map((review, index) => (
                    <div key={index} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                             {(review.userName || "A").charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900">{review.userName || "Guest User"}</h4>
                            <div className="flex">{renderStars(review.stars || 5)}</div>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">{review.date || "Recently"}</p>
                          <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    </div>
                  ))}
                  {fieldData.rating.length > 3 && (
                    <button onClick={() => setShowAllReviews(!showAllReviews)} className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition">
                      {showAllReviews ? "Show Less" : `View all ${fieldData.rating.length} reviews`}
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-8 bg-white border border-dashed border-gray-300 rounded-xl text-center text-gray-500">
                    No reviews yet. Be the first to play here!
                </div>
              )}
            </section>

            {/* Location */}
            <section ref={refs.location} className="border-t border-gray-200 pt-8 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Location</h2>
              <div className="rounded-xl overflow-hidden border border-gray-200 h-64 md:h-80 bg-gray-100 relative shadow-sm">
                  {(fieldData?.latitude && fieldData?.longitude) ? (
                    <iframe 
                        title="map"
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        loading="lazy"
                        // --- FIX: Corrected Map URL Syntax ---
                        src={`https://maps.google.com/maps?q=${fieldData.latitude},${fieldData.longitude}&z=15&output=embed`}
                        className="w-full h-full grayscale-[20%] hover:grayscale-0 transition duration-500"
                    ></iframe>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                        <MapPin size={32} />
                        <p>Map preview unavailable</p>
                    </div>
                  )}
              </div>
              <div className="mt-4 flex items-start gap-3 text-gray-600 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <MapPin size={20} className="text-green-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{fieldData?.address || "Address details unavailable"}</span>
              </div>
            </section>

             {/* Policies */}
             <section ref={refs.policy} className="border-t border-gray-200 pt-8 pb-8 scroll-mt-28">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Venue Policies</h2>
              {(() => {
                  const policyId = fieldData?.cancellationPolicy ?? 2;
                  const policy = CANCELLATION_POLICIES[policyId] || CANCELLATION_POLICIES[2];
                  return (
                    <div className={`${policy.bg} border ${policy.border} rounded-xl p-5 flex gap-4 items-start`}>
                      <div className={`p-2 bg-white rounded-full ${policy.iconColor} shadow-sm shrink-0`}><Clock size={20} /></div>
                      <div>
                          <h4 className={`font-bold ${policy.color} mb-1`}>{policy.title}</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{policy.desc}</p>
                      </div>
                    </div>
                  );
                })()}
            </section>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div ref={refs.calendar} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
              <div className="mb-5 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900">Book Your Spot</h3>
                <p className="text-sm text-gray-500">Instant confirmation</p>
              </div>
              
              <div className="flex justify-center mb-6">
                 <style>{`
                  .react-datepicker { border: none; font-family: inherit; width: 100%; }
                  .react-datepicker__month-container { float: none; width: 100%; }
                  .react-datepicker__header { background: white; border: none; padding-top: 0; }
                  .react-datepicker__day-name { color: #9ca3af; width: 2.2rem; line-height: 2.2rem; }
                  .react-datepicker__day { width: 2.2rem; line-height: 2.2rem; border-radius: 50%; transition: 0.2s; margin: 0.15rem; }
                  .react-datepicker__day:hover { background-color: #f0fdf4; color: #16a34a; }
                  .react-datepicker__day--selected { background-color: #16a34a !important; color: white !important; font-weight: bold; }
                  .react-datepicker__day--keyboard-selected { background-color: #dcfce7; color: #166534; }
                  .react-datepicker__day--disabled { color: #e5e7eb; }
                `}</style>
                <DatePicker 
                    selected={selectedDate} 
                    onChange={(date) => setSelectedDate(date)} 
                    inline 
                    minDate={new Date()} 
                    maxDate={getMaxDate()} 
                />
              </div>

              <button 
                onClick={handleBooking} 
                disabled={!selectedDate} 
                className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2
                    ${selectedDate 
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 transform active:scale-95" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"}
                `}
              >
                {selectedDate ? "Book Now" : "Select a Date"} <ChevronRight size={20} />
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} /> <span>Secure SSL Booking</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE FLOATING ACTION BUTTON */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40 lg:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button onClick={handleMobileAction} className={`w-full py-3.5 rounded-xl font-bold text-base transition flex items-center justify-center gap-2 shadow-lg ${selectedDate ? "bg-green-600 text-white shadow-green-200" : "bg-gray-900 text-white"}`}>
            {selectedDate ? "Book Now" : "Select Date"} <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
};

export default FieldDetails;