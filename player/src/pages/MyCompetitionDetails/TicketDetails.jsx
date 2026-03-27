import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBell, FiMapPin, FiUserPlus, FiInfo } from "react-icons/fi";

 
import TicketHero from "../../components/TicketHero";
import VenueInfo from "../../components/VenueInfo";
import TeamRoster from "./../../components/TeamRoster";
import ImportantNotes from "../../components/ImportantNotes";

export default function TicketDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // ID = 1
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);

  const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJlMTYyMDZmMS1kMTI3LTQzYWYtYjg2Ny01MzZlYzA1ZjQ5NTciLCJ1bmlxdWVfbmFtZSI6IkNsZXZlbGFuZCBGYXkiLCJqdGkiOiIwOTY2ZTQ4OC00NTQ2LTQyOGItOGUxNS1hYjI4OGUxYzcxYjIiLCJyb2xlIjoiUGxheWVyIiwibmJmIjoxNzc0NTUyODE0LCJleHAiOjE3NzQ2NDI4MTQsImlhdCI6MTc3NDU1MjgxNCwiaXNzIjoiVHVyZnlQbGF5IiwiYXVkIjoiVHVyZnlQbGF5LUZyb250In0.2sF-gWZHHJ1rAS90AvFA8DkfMXugqrdqugagbVDWWSo";

 useEffect(() => {
  const fetchTicket = async () => {
    try {
      console.log("📡 Sending Request to Ticket API...");
     
const response = await axios.get(
  `http://turfyplaylite.runasp.net/Turfy/GetTicketDetailsEndpoint/TicketDetails?ID=${id || 1}`, 
  { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
);

     
      console.log("✅ Server Response:", response.data);

      if (response.data.isSuccess && response.data.data) {
        setTicketData(response.data.data);
      } else {
       
        console.warn("⚠️ API Success but Data is EMPTY or null:", response.data.message);
      }
    } catch (error) {
       
      console.error("❌ API Crash Error:", error.response?.status, error.response?.data);
    } finally {
      setLoading(false);
    }
  };
  fetchTicket();
}, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black  text-[#22C55E] animate-pulse">GENERATING TICKET...</div>;
  if (!ticketData) return <div className="min-h-screen flex items-center justify-center font-black text-gray-300 italic">Ticket Data Not Found</div>;

  const { competitionCard, enrollmentObject, venueInfo } = ticketData;
 console.log("Current Ticket State:", ticketData);
  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans antialiased text-[#1E293B] pb-10">
      
      {/* 🟢 Navbar */}
      <header className="bg-white border-b border-[#EBECEF] sticky top-0 z-50 px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             
            <h1 className="text-xl font-bold tracking-tight">Turfy Play</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            {["Home", "Competitions", "Venues", "My Profile"].map((item) => (
              <a key={item} href="#" className={item === "My Profile" ? "text-[#22C55E]" : "hover:text-[#1E293B]"}>{item}</a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-gray-50 rounded-full text-gray-400 border border-gray-100"><FiBell size={20} /></button>
            <img src={enrollmentObject.teamLogoUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 mt-4 space-y-8">
        <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">My Ticket: {competitionCard.sportType} Championship</h2>

        {/* 1. Ticket Card Hero */}
        <TicketHero card={competitionCard} team={enrollmentObject} />

        {/* 2. Venue & Check-in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VenueInfo venue={venueInfo} />
          
          {/* Check-in Section */}
          <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><FiUserPlus /></div>
                <h3 className="text-lg font-black text-[#1E293B]">Check-in</h3>
             </div>
             <p className="text-sm font-bold text-gray-400 mb-4">Your Team Check-in Code:</p>
             <div className="bg-[#F1F5F9] border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                <span className="text-4xl font-black tracking-[0.3em] text-[#1E293B]">
                    {competitionCard.checkInCode || "123456"} 
                </span>
             </div>
             <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest text-center">Present this code to the organizer upon arrival.</p>
          </div>
        </div>

        {/* 3. Team Roster */}
        <TeamRoster captain={enrollmentObject.teamCaptain} nickname={enrollmentObject.teamNickname} />

        {/* 4. Important Notes */}
        
<ImportantNotes rules={competitionCard.rules} />
      </main>
    </div>
  );
}