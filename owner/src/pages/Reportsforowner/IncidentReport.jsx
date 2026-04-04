import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";

import { fetchIncidentBookingInfo } from "../../services/incidentApi";
import IncidentBookingCard from "../../components/IncidentReport/IncidentBookingCard";
import IncidentForm from "../../components/IncidentReport/IncidentForm";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function IncidentReport() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("BookingId") || 1; 
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  

  useEffect(() => {
    const loadBookingInfo = async () => {
      try {
        const responseData = await fetchIncidentBookingInfo(bookingId);
        
        if (responseData.isSuccess) {
          setBookingData(responseData.data);
          setError(null);
        } else {
          setError(responseData.message);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("An unexpected error occurred while fetching booking data.");
      } finally {
        setLoading(false);
      }
    };
    loadBookingInfo();
  }, [bookingId]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#22C55E] animate-pulse">Loading Report Data...</div>;

  
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto font-display">
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl max-w-md text-center space-y-6 animate-fadeIn w-full">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <FiAlertCircle size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#1E293B]">Action Denied</h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              {error} 
            </p>
          </div>
          <Link 
            to="/owner-bookings" 
            className="flex items-center justify-center gap-2 w-full bg-[#1E293B] text-white py-4 rounded-xl font-black hover:bg-black transition-all shadow-lg"
          >
            <FiArrowLeft /> Back to Bookings
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12 font-display">
      <div className="mb-10">
        <nav className="text-[10px] md:text-xs text-gray-400 mb-2 uppercase tracking-widest font-black">Dashboard / Bookings / Report Issue</nav>
        <h1 className="text-3xl md:text-4xl font-black text-[#1E293B] tracking-tight">File Incident Report</h1>
      </div>

      <div className="max-w-5xl">
        <IncidentBookingCard data={bookingData} />
        <IncidentForm bookingId={bookingId} />
      </div>
    </div>
  );
}