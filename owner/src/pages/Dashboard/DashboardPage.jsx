import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFieldDashboardOverview, fetchOwnerFields } from '../../services/dashboardApi';


import StatCard from '../../components/Dashboard/StatCard';
import GuaranteeProgress from '../../components/Dashboard/GuaranteeProgress';
import TodayTimeline from '../../components/Dashboard/TodayTimeline';
import ActiveFieldsList from '../../components/Dashboard/ActiveFieldsList';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // States 
  const [dashboardData, setDashboardData] = useState(null);
  const [ownerFields, setOwnerFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fieldsRes = await fetchOwnerFields();
        if (fieldsRes.isSuccess && fieldsRes.data.length > 0) {
          setOwnerFields(fieldsRes.data);
          setSelectedFieldId(fieldsRes.data[0].fieldId); 
        } else {
          setError("No fields found for this owner.");
          setIsLoading(false);
        }
      } catch (err) {
        setError("Failed to connect to the server");
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  //
  useEffect(() => {
    if (!selectedFieldId) return;

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const dashboardRes = await fetchFieldDashboardOverview(selectedFieldId);
        if (dashboardRes.isSuccess) {
          setDashboardData(dashboardRes.data);
        }
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedFieldId]);

  // 
  if (isLoading) return <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading Real-time Data...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium bg-red-50 m-6 rounded-lg border border-red-100">{error}</div>;
  if (!dashboardData) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Dashboard / <span className="text-gray-500 font-normal">{dashboardData.fieldName}</span>
          </h1>
        </div>
        <button 
          onClick={() => navigate('/schedule')} 
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-sm"
        >
          + Add Offline Booking
        </button>
      </div>

      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Today's Bookings" value={`${dashboardData.todayBookedSlots}/${dashboardData.todayTotalSlots}`} subtext="Slots Filled" />
        <StatCard title="Total Revenue (Month)" value={dashboardData.monthlyRevenue.toLocaleString()} subtext="EGP" />
        <StatCard title="Pending Payout" value={dashboardData.pendingPayout.toLocaleString()} subtext="EGP" />
        <StatCard title="Field Rating" value={dashboardData.fieldRating} subtext="Stars" />
      </div>

      {/* 2. Guarantee Progress */}
      {dashboardData.hasActivePromotion && (
        <GuaranteeProgress 
          current={dashboardData.currentPromoBookings} 
          target={dashboardData.targetPromoBookings} 
          rewardText={dashboardData.promoRewardText} 
        />
      )}

      {/* 3. Today's Timeline */}
      <TodayTimeline timelineData={dashboardData.todayTimeline} />

      {/* 4. Active Fields */}
      <ActiveFieldsList 
        fields={ownerFields} 
        currentFieldId={selectedFieldId} 
        onSelectField={setSelectedFieldId} 
      />
    </div>
  );
};

export default Dashboard;