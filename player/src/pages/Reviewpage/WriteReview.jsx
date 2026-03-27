import React, { useState } from "react";
import axios from "axios";
import { FiArrowLeft, FiBell, FiStar } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import CustomRangeSlider from "../../components/CustomRangeSlider";

export default function WriteReview() {
  const navigate = useNavigate();
  const { bookingId } = useParams(); 

  const [overallRating, setOverallRating] = useState(0); 
  const [reviewText, setReviewText] = useState(""); 
  const [submitting, setSubmitting] = useState(false);
  const [sliders, setSliders] = useState({
    turfQuality: 30,  
    facilities: 30,
    staffService: 30
  });

  const ratingLabels = ["Poor", "Below Average", "Average", "Good", "Excellent"];

  const handleSubmitReview = async () => {
    setSubmitting(true);
    const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJlMTYyMDZmMS1kMTI3LTQzYWYtYjg2Ny01MzZlYzA1ZjQ5NTciLCJ1bmlxdWVfbmFtZSI6IkNsZXZlbGFuZCBGYXkiLCJqdGkiOiIwOTY2ZTQ4OC00NTQ2LTQyOGItOGUxNS1hYjI4OGUxYzcxYjIiLCJyb2xlIjoiUGxheWVyIiwibmJmIjoxNzc0NTUyODE0LCJleHAiOjE3NzQ2NDI4MTQsImlhdCI6MTc3NDU1MjgxNCwiaXNzIjoiVHVyZnlQbGF5IiwiYXVkIjoiVHVyZnlQbGF5LUZyb250In0.2sF-gWZHHJ1rAS90AvFA8DkfMXugqrdqugagbVDWWSo";



    const testPayload = {
      bookId: Number(bookingId) || 1,
      score: overallRating || null,
      comment: reviewText || null,
      qualityScore: sliders.turfQuality || null,
      facilityAndAmenitiesScore: sliders.facilities || null,
      staffAndServiceScore: sliders.staffService || null
    };

    try {
      const API_URL = "http://turfyplaylite.runasp.net/Turfy/CreateReviewEndpoint/Handle";
      const response = await axios.post(API_URL, testPayload, {
        headers: { 
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json' 
        }
      });
      console.log("✅ Success Response:", response.data);
      alert("Review Submitted Successfully!");
      //navigate(-1);
    } catch (error) {
      console.error("❌ Submission Error:", error.response?.status);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans antialiased text-[#1E293B]">
      
      {/* Header - Responsive Design */}
      <header className="bg-white border-b border-[#EBECEF] sticky top-0 z-50 px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold tracking-tight">Turfy Play</h1>
          </div>
          
          {/* مخفي في الموبايل عشان المساحة */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            {["Home", "Bookings", "My Profile"].map((item) => (
              <a key={item} href="#" className={item === "My Profile" ? "text-[#22C55E]" : "hover:text-[#1E293B]"}>{item}</a>
            ))}
          </nav>
          
          <div className="flex items-center gap-3 md:gap-4">
            <button className="relative p-2 text-gray-400 border border-[#EBECEF] bg-white rounded-full">
              <FiBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <img src="https://turfy-assets.runasp.net/mock-assets/player_avatar.png" alt="Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 mt-2 md:mt-4">
        
        {/* Title Section - Responsive Spacing */}
        <div className="flex items-start gap-3 md:gap-4 mb-6 md:mb-10">
          <button onClick={() => navigate(-1)} className="mt-1 p-1 text-gray-400 hover:text-gray-900 active:scale-95">
            <FiArrowLeft size={24} />
          </button>
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl md:text-3xl font-black text-[#1E293B] tracking-tight">Write a Review</h2>
            <p className="text-xs md:text-sm text-[#22C55E] font-bold">Let us know about your experience at the field.</p>
          </div>
        </div>
        
        {/* Main Card - Responsive Padding */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-[#EBECEF] shadow-sm p-5 md:p-10 space-y-8 md:space-y-12">
          
          {/* Stars Section */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-[#1E293B] mb-4">How was your game? <span className="text-red-500">*</span></h3>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {[1, 2, 3, 4, 5].map((star, index) => (
                <button key={star} onClick={() => setOverallRating(star)} className="relative group">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 transition-all flex items-center justify-center
                    ${star <= overallRating ? "bg-[#22C55E] border-[#22C55E]" : "bg-white border-[#EBECEF]"}`}>
                    <FiStar size={20} className={star <= overallRating ? "fill-white text-white" : "text-gray-300"} />
                  </div>
                  {/* Tooltip مخفي في الموبايل عشان ميضايقش اللمس */}
                  <span className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1E293B] text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {ratingLabels[index]}
                  </span>
                </button>
              ))}
              {overallRating > 0 && (
                <span className="text-sm font-black text-[#22C55E] ml-2 animate-pulse">
                  {ratingLabels[overallRating - 1]}
                </span>
              )}
            </div>
          </section>

          {/* Textarea Section */}
          <section>
            <h3 className="text-lg md:text-xl font-bold text-[#1E293B] mb-3">Share your experience</h3>
            <textarea 
              rows={4} 
              value={reviewText} 
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about the turf, lighting, etc." 
              className="w-full bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-4 text-sm font-medium focus:border-[#22C55E] outline-none transition-all placeholder:text-gray-400"
            />
          </section>

          {/* Sliders Section */}
          <section className="space-y-6 md:space-y-8">
            <h3 className="text-lg md:text-xl font-bold text-[#1E293B]">Specifics (Optional)</h3>
            <div className="grid grid-cols-1 gap-6">
              <CustomRangeSlider label="Turf Quality" value={sliders.turfQuality} onChange={(v) => setSliders({...sliders, turfQuality: v})} />
              <CustomRangeSlider label="Facilities & Amenities" value={sliders.facilities} onChange={(v) => setSliders({...sliders, facilities: v})} />
              <CustomRangeSlider label="Staff & Service" value={sliders.staffService} onChange={(v) => setSliders({...sliders, staffService: v})} />
            </div>
          </section>

          {/* Submit Button - Full width on Mobile */}
          <div className="pt-4 md:pt-8">
            <button 
              onClick={handleSubmitReview}
              disabled={submitting || overallRating === 0}
              className="w-full md:w-auto px-12 py-4 bg-[#10B981] text-white rounded-full text-sm font-black hover:bg-[#059669] transition-all shadow-lg active:scale-95 disabled:bg-gray-200 uppercase tracking-widest"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}