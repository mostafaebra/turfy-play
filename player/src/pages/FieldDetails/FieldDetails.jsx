import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
// Services & Utils
import { getFieldDetails } from "../../services/fieldService";
import { getFacilitiesList } from "../../utils/mappings";

// External Libraries
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Icons
import {
  MapPin,
  Star,
  ChevronLeft,
  ArrowLeft,
  Zap,
  Car,
  Armchair,
  Waves,
  ShieldCheck,
  Clock,
  Shirt,
  CircleDashed,
  ChevronRight,
} from "lucide-react";

// --- CONSTANTS ---

const AMENITY_ICONS = {
  "Professional Lighting": { icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
  "Changing Rooms": { icon: Shirt, color: "text-purple-600", bg: "bg-purple-50" },
  Showers: { icon: Waves, color: "text-cyan-600", bg: "bg-cyan-50" },
  "Secure Parking": { icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
  "Ball Rental": { icon: CircleDashed, color: "text-orange-600", bg: "bg-orange-50" },
  "Spectator Seating": { icon: Armchair, color: "text-indigo-600", bg: "bg-indigo-50" },
};

const CANCELLATION_POLICIES = {
  1: {
    title: "Flexible Cancellation",
    desc: "You can cancel your booking up to 24 hours before the match starts for a full refund. No fees applied.",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    iconColor: "text-green-600",
  },
  2: {
    title: "Moderate Policy",
    desc: "Cancellations made 24 hours prior receive a 50% refund. No refund for cancellations made within 24 hours of the match.",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconColor: "text-orange-600",
  },
  3: {
    title: "Strict Policy (Non-refundable)",
    desc: "This booking is non-refundable. Once booked, the slot cannot be cancelled, rescheduled, or transferred under any circumstances.",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    iconColor: "text-red-600",
  },
};

const FieldDetails = () => {
  // --- HOOKS ---
  const navigate = useNavigate();
  const { id } = useParams();

  // Refs
  const descriptionRef = useRef(null);
  const amenitiesRef = useRef(null);
  const reviewsRef = useRef(null);
  const locationRef = useRef(null);
  const policyRef = useRef(null);
  const calendarRef = useRef(null);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("description");
  const [fieldData, setFieldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  // Touch State
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // --- EFFECTS ---

  // 1. Fetch Field Details
  useEffect(() => {
    const fetchField = async () => {
      try {
        setLoading(true);
        const fieldId = id || 33;
        const response = await getFieldDetails(fieldId);

        if (response.isSuccess) {
          setFieldData(response.data);
        } else {
          setError("Failed to load field data");
        }
      } catch (err) {
        console.error(err);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };
    fetchField();
  }, [id]);

  // 2. Handle Scroll Spy (Active Tab)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        setActiveTab("policy");
        return;
      }

      if (policyRef.current && scrollPosition >= policyRef.current.offsetTop) setActiveTab("policy");
      else if (locationRef.current && scrollPosition >= locationRef.current.offsetTop) setActiveTab("location");
      else if (reviewsRef.current && scrollPosition >= reviewsRef.current.offsetTop) setActiveTab("reviews");
      else if (amenitiesRef.current && scrollPosition >= amenitiesRef.current.offsetTop) setActiveTab("amenities");
      else if (descriptionRef.current && scrollPosition >= descriptionRef.current.offsetTop) setActiveTab("description");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HANDLERS & LOGIC ---

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

  const scrollToSection = (ref) => {
    if(ref.current) {
        window.scrollTo({ top: ref.current.offsetTop - 100, behavior: "smooth" });
    }
  };

  const displayImages = fieldData?.imagesURLs?.length > 0 ? fieldData.imagesURLs : [
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2070",
    "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=2070",
    "https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=2070",
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
    const rawDays = fieldData.availableDays || fieldData.availableDayes;
    const daysToAdd = rawDays ? parseInt(rawDays, 10) : 0;
    if (!daysToAdd) return null;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + daysToAdd);
    return maxDate;
  };

  // --- UPDATED BOOKING HANDLER ---
  const handleBooking = () => {
    if (!selectedDate) return;

    // Format Date YYYY-MM-DD
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    
    // Use ID from params or fieldData
    const currentId = id || fieldData?.id;

    // Navigate to new booking route
    navigate(`/booking/${currentId}/${formattedDate}`);
  };

  // --- THIS WAS MISSING: MOBILE ACTION HANDLER ---
  const handleMobileAction = () => {
    if (selectedDate) {
      handleBooking();
    } else {
      if (calendarRef.current) {
        const yOffset = -150;
        const y = calendarRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  // --- RENDER LOADING / ERROR ---
  if (loading) return <div className="h-screen flex justify-center items-center text-green-600 font-bold text-xl">Loading Field...</div>;
  if (error || !fieldData) return <div className="h-screen flex justify-center items-center text-red-500 text-xl">{error || "Field Not Found"}</div>;

  // --- MAIN RENDER ---
  return (
    <>
    <Navbar/>

    <div className="min-h-screen bg-gray-50 pb-12">
      {/* === HERO IMAGE SECTION === */}
      <div className="relative h-[400px] w-full group" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <img src={displayImages[currentImageIndex]} alt={fieldData?.name || "Stadium"} className="w-full h-full object-cover transition-opacity duration-500" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 md:top-6 md:left-6 p-3 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition z-20">
          <ArrowLeft size={20} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 text-white rounded-full backdrop-blur-md hover:bg-white/30 transition opacity-70 hover:opacity-100"><ChevronLeft size={24} /></button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/30 text-white rounded-full backdrop-blur-md hover:bg-white/30 transition opacity-70 hover:opacity-100"><ChevronRight size={24} /></button>
        <div ref={descriptionRef} className="absolute bottom-0 left-0 w-full p-4 pb-12 md:p-8 z-10">
          <div className="container mx-auto">
            <div className="flex flex-col gap-1 md:gap-2">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Star fill="currentColor" size={18} />
                <span className="text-white font-bold">{fieldData?.totalRating || 0}</span>
                <span className="text-gray-300 text-sm">({fieldData?.reviewsCount || 0} reviews)</span>
              </div>
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-1 md:mb-2 leading-tight">{fieldData?.name || "Loading..."}</h1>
              <div className="flex items-center gap-2 text-gray-200 text-sm md:text-lg">
                <MapPin size={16} className="text-green-400 md:w-5 md:h-5" /> <span>{fieldData?.address || "No Address"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {displayImages.map((_, index) => (
            <div key={index} className={`h-2 w-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white w-4" : "bg-white/50"}`}></div>
          ))}
        </div>
      </div>

      {/* === CONTENT GRID === */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="sticky top-0 md:top-[0px] z-30 bg-gray-50 pt-2 pb-1 mb-8 transition-all shadow-sm">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 md:gap-x-8 border-b border-gray-200 text-gray-500 font-medium px-2 md:px-0">
                {["description", "amenities", "reviews", "location", "policy"].map((tab) => (
                  <button key={tab} onClick={() => { const refs = { description: descriptionRef, amenities: amenitiesRef, reviews: reviewsRef, location: locationRef, policy: policyRef }; scrollToSection(refs[tab]); }} className={`pb-2 capitalize whitespace-nowrap transition-colors text-sm md:text-base ${activeTab === tab ? "border-b-2 border-green-500 text-green-600" : "hover:text-green-600 border-b-2 border-transparent"}`}>
                    {tab === "reviews" ? `Reviews (${fieldData.reviewsCount})` : tab}
                  </button>
                ))}
              </div>
            </div>

            <section className="animate-fade-in-up">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">About this venue</h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                Welcome to <span className="font-bold text-gray-900">{fieldData?.name}</span>, the premier destination for sports enthusiasts in <span className="text-gray-800">{fieldData?.address ? fieldData.address.split(",")[0] : "the area"}</span>. This facility is proud to feature a top-tier <span className="font-bold text-green-600">{fieldData?.surfaceType || "Standard"}</span> surface. <br className="mb-2 block" /> Whether you are organizing a competitive league or a friendly match, our field is perfectly sized for <span className="font-bold text-blue-600">{fieldData?.fieldSize} games</span>.
              </p>
            </section>

            <section ref={amenitiesRef} className="border-t border-gray-100 pt-8 scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              {getFacilitiesList(fieldData?.facilities).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-y-4 gap-x-8">
                  {getFacilitiesList(fieldData.facilities).map((amenityName, index) => {
                    const config = AMENITY_ICONS[amenityName] || { icon: ShieldCheck, color: "text-gray-600", bg: "bg-gray-100" };
                    const TheIcon = config.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 text-gray-700">
                        <div className={`p-2 rounded-full ${config.bg} ${config.color}`}><TheIcon size={20} /></div>
                        <span className="text-sm md:text-base font-medium">{amenityName}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (<p className="text-gray-500 italic">No amenities listed for this venue.</p>)}
            </section>

            <section ref={reviewsRef} className="border-t border-gray-100 pt-8 mb-10 scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Reviews <span className="text-gray-400 text-lg font-normal">({fieldData?.rating?.length || 0})</span></h2>
              </div>
              {fieldData?.rating && fieldData.rating.length > 0 ? (
                <div className="space-y-6">
                  {(() => {
                    const initialLimit = 5;
                    const displayedReviews = showAllReviews ? fieldData.rating : fieldData.rating.slice(0, initialLimit);
                    return displayedReviews.map((review, index) => (
                      <div key={index} className="flex gap-4 items-start border-b border-gray-50 pb-6 last:border-0">
                        <img src={review.imageURL || `https://ui-avatars.com/api/?name=${review.userName || "User"}&background=random`} alt={review.userName} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div><h4 className="font-bold text-gray-900">{review.userName || "Anonymous"}</h4><p className="text-xs text-gray-400">{review.date || "Recent"}</p></div>
                            <div className="flex gap-0.5">{renderStars(review.stars || 0)}</div>
                          </div>
                          <p className="text-gray-600 text-sm md:text-base leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    ));
                  })()}
                  {fieldData.rating.length > 5 && (
                    <button onClick={() => setShowAllReviews(!showAllReviews)} className="w-full mt-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition flex justify-center items-center gap-2">
                      {showAllReviews ? <>Show Less <ChevronLeft className="rotate-90" size={16} /></> : <>Show all {fieldData.rating.length} reviews <ChevronRight className="rotate-90" size={16} /></>}
                    </button>
                  )}
                </div>
              ) : (<div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200"><p className="text-gray-500">No reviews yet. Be the first to review!</p></div>)}
            </section>

            <section ref={locationRef} className="border-t border-gray-100 pt-8 scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Location</h2>
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group h-72 md:h-96 bg-gray-100 transition-all">
                {(() => {
                  const lat = fieldData?.Latitude || fieldData?.latitude;
                  const lng = fieldData?.Longitude || fieldData?.longitude;
                  if (lat && lng) {
                    return (
                      <>
                        <iframe title="Field Location" width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed`} className="w-full h-full filter grayscale-[20%] group-hover:grayscale-0 transition duration-500"></iframe>
                        <div className="absolute top-4 right-4 z-10"><button onClick={() => window.open(`https://maps.google.com/maps?q=${lat},${lng}`, "_blank")} className="bg-white text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold shadow-lg hover:bg-green-600 hover:text-white transition flex items-center gap-2 text-xs md:text-sm"><MapPin size={14} className="text-red-500 hover:text-white md:w-4 md:h-4" /> Open in Maps</button></div>
                      </>
                    );
                  } else {
                    return <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col gap-2"><MapPin size={40} /><p>Location coordinates not available</p></div>;
                  }
                })()}
              </div>
              <div className="mt-4 flex items-start gap-3 text-gray-600"><MapPin className="mt-1 shrink-0 text-gray-400" size={20} /><p className="text-sm md:text-base leading-relaxed font-medium">{fieldData?.address || "Address details not available"}</p></div>
            </section>

            <section ref={policyRef} className="border-t border-gray-100 pt-8 pb-8 scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Venue Policies</h2>
              <div className="space-y-4">
                {(() => {
                  const policyId = fieldData?.cancellationPolicy ?? 2;
                  const policy = CANCELLATION_POLICIES[policyId] || CANCELLATION_POLICIES[2];
                  return (
                    <div className={`${policy.bg} border ${policy.border} rounded-xl p-4 flex gap-4 items-start transition-colors`}>
                      <div className={`p-2 bg-white rounded-full ${policy.iconColor} shadow-sm shrink-0`}><Clock size={20} /></div>
                      <div><h4 className={`font-bold ${policy.color} mb-1`}>{policy.title}</h4><p className="text-sm text-gray-700 leading-relaxed">{policy.desc}</p></div>
                    </div>
                  );
                })()}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1" ref={calendarRef}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900">Select Date</h3>
                <p className="text-sm text-gray-500 mt-1">Pick a day to check availability</p>
              </div>
              <div className="mb-6 flex justify-center">
                <style>{`
                  .react-datepicker { font-family: inherit; border: none; background-color: white; }
                  .react-datepicker__header { background-color: white; border-bottom: none; }
                  .react-datepicker__current-month { font-weight: 700; color: #111827; margin-bottom: 10px; }
                  .react-datepicker__day-name { color: #9CA3AF; font-weight: 600; width: 2.5rem; }
                  .react-datepicker__day { width: 2.5rem; line-height: 2.5rem; border-radius: 50%; transition: all 0.2s; }
                  .react-datepicker__day:hover { background-color: #f0fdf4; color: #16a34a; }
                  .react-datepicker__day--selected { background-color: #16a34a !important; color: white !important; font-weight: bold; }
                  .react-datepicker__day--keyboard-selected { background-color: #dcfce7; color: #166534; }
                  .react-datepicker__day--disabled { color: #e5e7eb; }
                  .react-datepicker__navigation-icon::before { border-color: #374151; }
                `}</style>
                <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} inline minDate={new Date()} maxDate={getMaxDate()} dateFormat="yyyy-MM-dd" />
              </div>
              <button onClick={handleBooking} disabled={!selectedDate} className={`hidden lg:flex w-full py-4 rounded-xl font-bold text-lg transition items-center justify-center gap-2 ${selectedDate ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 cursor-pointer transform hover:-translate-y-1" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                {selectedDate ? "Book Now" : "Select a Date"} <ChevronRight size={20} />
              </button>
              <p className="text-center text-xs text-gray-400 mt-4 hidden lg:block">Availability is updated in real-time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          {/* THE MISSING FUNCTION IS CALLED HERE */}
          <button onClick={handleMobileAction} className={`flex-1 py-3 rounded-xl font-bold text-base transition flex items-center justify-center gap-2 shadow-lg ${selectedDate ? "bg-green-600 text-white hover:bg-green-700 shadow-green-200" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
            {selectedDate ? "Book Now" : "Select a Date"} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default FieldDetails;