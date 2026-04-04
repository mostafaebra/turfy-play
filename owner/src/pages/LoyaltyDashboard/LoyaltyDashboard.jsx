import React, { useState, useEffect } from "react";
import { FiStar } from "react-icons/fi";

import { fetchLoyaltyDashboard } from "../../services/loyaltyApi";


import LoyaltyProgressCard from "../../components/Loyalty/LoyaltyProgressCard";
import LoyaltyHistoryTable from "../../components/Loyalty/LoyaltyHistoryTable";
import LoyaltyBenefits from "../../components/Loyalty/LoyaltyBenefits"; 

export default function LoyaltyDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 3. استخدمنا الدالة النظيفة من غير توكن ولا headers
        const responseData = await fetchLoyaltyDashboard();
        
        if (responseData && responseData.isSuccess) {
          setData(responseData.data);  
        }
      } catch (error) {
        console.error("Failed to load loyalty dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#FACC15] animate-pulse">Syncing Loyalty Program...</div>;

  return (
    // 4. شيلنا السايد بار القديم وخلينا الصفحة تبدأ من هنا عشان تركب جوه الـ Layout بتاعك
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 font-display">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
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
          {data.hasActiveProgram === false ? (
            <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center text-center gap-6 border-2 border-dashed border-gray-100 animate-fadeIn shadow-sm">
              <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500">
                <FiStar size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-[#1E293B]">No Active Loyalty Program</h2>
                <p className="text-gray-400 font-bold max-w-sm mx-auto">Boost your field bookings by activating a loyalty program for your customers today!</p>
              </div>
              <button className="bg-[#22C55E] text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-600 transition-colors">
                Activate Now
              </button>
            </div>
          ) : (
            <div className="animate-fadeIn space-y-6">
              <LoyaltyProgressCard data={data} />
              <LoyaltyBenefits />
              <LoyaltyHistoryTable history={data.history || []} />
            </div>
          )}
        </>
      )}
    </div>
  );
}