import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../layouts/sidebar.jsx"; 
import IncidentBookingCard from "../../components/IncidentBookingCard";
import IncidentForm from "../../components/IncidentForm";
import { FiMenu, FiGrid, FiCalendar, FiUsers, FiBarChart2, FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function IncidentReport() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("BookingId") || 1; 
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchBookingInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://turfy.runasp.net/Turfy/GetIssuePageEndpoint/Execute?BookingId=${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        
        if (response.data.isSuccess) {
          setBookingData(response.data.data);
          setError(null);
        } else {
         
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("An unexpected error occurred while fetching booking data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingInfo();
  }, [bookingId]);

 const incidentReportMenu = [
  { label: "Dashboard", path: "/dashboard", icon: <FiGrid size={18} /> },
  { label: "Bookings", path: "/bookings", icon: <FiCalendar size={18} /> },
  { label: "Players", path: "/players", icon: <FiUsers size={18} /> },
  { label: "Reports", path: "/reports", icon: <FiBarChart2 size={18} /> },
];
  
  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#22C55E] animate-pulse">Loading Report Data...</div>;

   
  if (error) {
    return (
      <div cclassName="flex">
    <Sidebar 
      menuItems={incidentReportMenu} 
      businessName="Turfy Play"  
      isOpen={isSidebarOpen} 
      setIsOpen={setIsSidebarOpen} 
    />
        <main className="flex-1 flex flex-col items-center justify-center p-6 lg:ml-64">
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl max-w-md text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <FiAlertCircle size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#1E293B]">Action Denied</h2>
              <p className="text-gray-400 font-medium leading-relaxed">
                {error} {/* عرض الرسالة الديناميكية من الباك-إند */}
              </p>
            </div>
            <Link 
              to="/owner-bookings" 
              className="flex items-center justify-center gap-2 w-full bg-[#1E293B] text-white py-4 rounded-xl font-black hover:bg-black transition-all shadow-lg"
            >
              <FiArrowLeft /> Back to Bookings
            </Link>
          </div>
        </main>
      </div>
    );
  }

   
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-display">
      <Sidebar menuItems={menu} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 lg:p-12">
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mb-6 p-2 bg-white rounded-lg border border-gray-200">
           <FiMenu size={24} />
        </button>

        <div className="mb-10">
          <nav className="text-[10px] md:text-xs text-gray-400 mb-2 uppercase tracking-widest font-black">Dashboard / Bookings / Report Issue</nav>
          <h1 className="text-3xl md:text-4xl font-black text-[#1E293B] tracking-tight">File Incident Report</h1>
        </div>

        <div className="max-w-5xl">
          <IncidentBookingCard data={bookingData} />
          <IncidentForm bookingId={bookingId} />
        </div>
      </main>
    </div>
  );
}