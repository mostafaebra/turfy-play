import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../layouts/sidebar";
import LoyaltyProgressCard from "../../components/LoyaltyProgressCard";
import LoyaltyHistoryTable from "../../components/LoyaltyHistoryTable";
import LoyaltyBenefits from "../../components/LoyaltyBenefits"; 
import { FiGrid, FiCalendar, FiStar, FiMenu } from "react-icons/fi";

export default function LoyaltyDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loyaltyMenu = [
    { label: "Dashboard", path: "/dashboard", icon: <FiGrid size={18} /> },
    { label: "Bookings", path: "/bookings", icon: <FiCalendar size={18} /> },
    { label: "Loyalty", path: "/owner-loyalty", icon: <FiStar size={18} /> },
  ];

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        const token = localStorage.getItem("token");
        const fieldId = 1; 
        const response = await axios.get(`http://turfywafaa.runasp.net/Turfy/GetLoyaltyDashboardEndpoint/GetDashboard/${fieldId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

       
        if (response.data && response.data.isSuccess) {
          console.log("Setting Data to State:", response.data.data);
          setData(response.data.data);  
        }
      } catch (error) {
        console.error("Loyalty Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoyaltyData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#FACC15] animate-pulse">Syncing Loyalty Program...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-display">
      <Sidebar 
        menuItems={loyaltyMenu} 
        businessName="Turfy Play" 
        dark={true}  
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 w-full lg:ml-72 p-6 md:p-10 lg:p-14">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white rounded-xl border border-gray-200 shadow-sm"><FiMenu size={24} /></button>
             <div>
                <nav className="text-[10px] md:text-xs text-gray-400 mb-1 uppercase tracking-[0.3em] font-black">Dashboard / Loyalty</nav>
                <h1 className="text-3xl font-black text-[#1E293B]">Loyalty Program</h1>
             </div>
          </div>
          <div className="bg-[#FFFBEB] text-[#F59E0B] px-4 py-2 rounded-xl border border-yellow-100 text-xs font-black flex items-center gap-2">
            <FiStar /> Gold Partner
          </div>
        </div>

        {data && (
          <>
            { }
            {data.hasActiveProgram === false ? (
              <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center text-center gap-6 border-2 border-dashed border-gray-100 animate-fadeIn">
                <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500">
                   <FiStar size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-[#1E293B]">No Active Loyalty Program</h2>
                  <p className="text-gray-400 font-bold max-w-sm mx-auto">Boost your field bookings by activating a loyalty program for your customers today!</p>
                </div>
                <button className="bg-[#22C55E] text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-green-100">
                  Activate Now
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <LoyaltyProgressCard data={data} />
                <LoyaltyBenefits />
                { }
                <LoyaltyHistoryTable history={data.history || []} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}