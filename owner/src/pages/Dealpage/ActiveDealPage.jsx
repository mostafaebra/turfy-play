// src/pages/ActiveDealPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchVoucherDetails } from '../../services/voucherApi';
import ActiveDealHeader from '../../components/dealpage/ActiveDealHeader';
import KpiSection from '../../components/dealpage/KpiSection';
import ConfigurationDetails from '../../components/dealpage/ConfigurationDetails';
import { OptimizationBanner } from '../../components/dealpage/OptimizationBanner';
import { RedemptionTrends, RecentRedemptions } from '../../components/dealpage/DataSections';

const ActiveDealPage = () => {
  const { id } = useParams(); // URL should be something like /deals/:id
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback ID for testing purposes if none is provided in URL
  const activeId = id || 3; 

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const voucherData = await fetchVoucherDetails(activeId);
        setData(voucherData);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load deal data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-light-gray">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-light-gray font-display text-text-dark">
        <span className="material-symbols-outlined text-4xl text-red-400 mb-4">error_outline</span>
        <h2 className="text-xl font-bold mb-2">Failed to load deal</h2>
        <p className="text-text-light mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-secondary text-white rounded-lg">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray font-display">
      
      {/* Top Header Navigation */}
      <header className="h-16 border-b border-border-color bg-white flex items-center justify-between px-8 sticky top-0 z-10">
        <nav className="flex items-center gap-2 text-sm">
          <a href="/dashboard" className="text-text-light hover:text-text-dark">Dashboard</a>
          <span className="material-symbols-outlined text-[16px] text-border-color">chevron_right</span>
          <a href="/deals" className="text-text-light hover:text-text-dark">Deals</a>
          <span className="material-symbols-outlined text-[16px] text-border-color">chevron_right</span>
          <span className="text-text-dark font-semibold">Deal Details</span>
        </nav>
        
        <button 
          onClick={() => navigate(-1)} // Go back
          className="flex items-center gap-2 px-4 py-1.5 border border-border-color rounded-lg text-sm font-bold text-text-dark hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Deals
        </button>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <ActiveDealHeader 
          title={data.name} 
          isActive={data.isActive} 
          launchDate={data.launchDate} 
        />
        
        <KpiSection kpis={data.kpis} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (1/3 width) */}
          <div className="space-y-6">
            <ConfigurationDetails config={data.configuration} />
            <OptimizationBanner />
          </div>

          {/* Right Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <RedemptionTrends trends={data.trends} />
            <RecentRedemptions redemptions={data.recentRedemptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActiveDealPage;