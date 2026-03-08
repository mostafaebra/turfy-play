import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Ticket, Info, Zap, CheckCircle2, DollarSign, TrendingUp, Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 

import StatCard from '../../components/voucher/Statcard';
import VoucherCard from '../../features/voucher/VoucherCard';
import VouchersTable from '../../features/voucher/VouchersTable';
import ConfirmationModal from '../../components/voucher/ConfirmationModal'; 

import { getVoucherDashboard, toggleVoucherStatus } from '../../services/voucherapi.js';

export default function VoucherPage() {
  const navigate = useNavigate(); 
  
  const [stats, setStats] = useState(null);
  const [venueOffers, setVenueOffers] = useState([]);
  const [normalVouchers, setNormalVouchers] = useState([]);

  // --- NEW: STATE TO TRACK HIDDEN ITEMS ---
  const [hiddenVenues, setHiddenVenues] = useState(new Set());
  const [hiddenNormals, setHiddenNormals] = useState(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [modalState, setModalState] = useState({ isOpen: false, id: null, isActive: null });
  const [isToggling, setIsToggling] = useState(false);

  const fetchInitialDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await getVoucherDashboard(1);
      
      setStats({
        activeOffersCount: data.activeOffersCount,
        vouchersRedeemedCount: data.vouchersRedeemedCount,
        totalRevenueSaved: data.totalRevenueSaved,
        averageRedemptionRate: data.averageRedemptionRate
      });
      
      setVenueOffers(data.activeVenueOffers || []);
      setNormalVouchers(data.normalVouchers || []);
      
      if (!data.activeVenueOffers?.length && !data.normalVouchers?.length) {
        setHasMoreData(false);
      }
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialDashboard();
  }, []);

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setIsFetchingMore(true);

    try {
      const newData = await getVoucherDashboard(nextPage);
      const hasNewVenues = newData.activeVenueOffers?.length > 0;
      const hasNewNormal = newData.normalVouchers?.length > 0;

      if (!hasNewVenues && !hasNewNormal) {
        setHasMoreData(false);
      } else {
        if (hasNewVenues) setVenueOffers(prev => [...prev, ...newData.activeVenueOffers]);
        if (hasNewNormal) setNormalVouchers(prev => [...prev, ...newData.normalVouchers]);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      alert("Failed to load more records. Please try again.");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleViewDetails = useCallback((id) => navigate(`/edit-voucher/${id}`), [navigate]);
  const handleEditVoucher = useCallback((id) => navigate(`/edit-voucher/${id}`), [navigate]);

  const handleDeactivateClick = useCallback((id, currentStatus) => {
    setModalState({ isOpen: true, id, isActive: currentStatus });
  }, []);

  const executeStatusToggle = async () => {
    if (!modalState.id) return;
    setIsToggling(true);
    try {
      await toggleVoucherStatus(modalState.id, modalState.isActive);
      await fetchInitialDashboard(); 
      setCurrentPage(1); 
      setModalState({ isOpen: false, id: null, isActive: null }); 
    } catch (err) {
      alert(err.message || "Failed to update voucher status.");
    } finally {
      setIsToggling(false);
    }
  };

  // --- NEW: HANDLERS TO HIDE ITEMS ---
  const handleHideVenue = useCallback((id) => {
    setHiddenVenues(prev => new Set(prev).add(id));
  }, []);

  const handleHideNormal = useCallback((id) => {
    setHiddenNormals(prev => new Set(prev).add(id));
  }, []);

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Dashboard Insights...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const statsMapping = [
    { id: 1, label: 'Active Offers', value: stats?.activeOffersCount || 0, icon: Zap, color: 'text-[#10b77f]' },
    { id: 2, label: 'Vouchers Redeemed', value: stats?.vouchersRedeemedCount || 0, icon: CheckCircle2, color: 'text-[#3b82f6]' },
    { id: 3, label: 'Total Revenue Saved', value: `$${stats?.totalRevenueSaved || 0}`, icon: DollarSign, color: 'text-[#10b77f]' },
    { id: 4, label: 'Avg. Redemption Rate', value: `${stats?.averageRedemptionRate || 0}%`, icon: TrendingUp, color: 'text-[#3b82f6]' },
  ];

  // --- NEW: FILTER OUT HIDDEN ITEMS BEFORE MAPPING ---
  const mappedVenueOffers = venueOffers
    .filter(offer => !hiddenVenues.has(offer.id)) // 👈 Filters out hidden ones
    .map(offer => ({
      id: offer.id,
      title: `${offer.percentage}% Off Offer`,
      desc: offer.description || `Code: ${offer.voucherId}`,
      tag: offer.isActive ? 'Active' : 'Inactive',
      tagColor: offer.isActive ? 'text-[#10b77f] bg-[#10b77f]/10' : 'text-slate-500 bg-slate-100',
      icon: Calendar,
      iconBg: 'bg-[#10b77f]/10 text-[#10b77f]',
      isActive: offer.isActive
    }));

  const mappedNormalVouchers = normalVouchers
    .filter(v => !hiddenNormals.has(v.id)) // 👈 Filters out hidden ones
    .map(v => ({
      dbId: v.id, 
      id: v.voucherId, 
      type: v.eligibility === 1 ? 'TRUSTED' : v.eligibility === 3 ? 'ABUSER' : 'NORMAL',
      percent: `${v.percentage}%`,
      desc: v.description || 'Standard Voucher',
      date: v.modified !== "0001-01-01T00:00:00" ? new Date(v.modified).toLocaleDateString() : 'N/A',
      statusColor: v.isActive ? 'bg-[#10b77f]/10 text-[#10b77f]' : 'bg-red-100 text-red-600',
      isActive: v.isActive
    }));

  return (
    <>
      <ConfirmationModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, id: null, isActive: null })}
        onConfirm={executeStatusToggle}
        title={modalState.isActive ? "Deactivate Voucher?" : "Activate Voucher?"}
        message={`Are you sure you want to ${modalState.isActive ? 'deactivate' : 'activate'} this voucher?`}
        isProcessing={isToggling}
        confirmText={modalState.isActive ? "Yes, Deactivate" : "Yes, Activate"}
        processingText={modalState.isActive ? "Deactivating..." : "Activating..."}
      />

      {/* Header (Same as before) */}
      <header className="bg-white border-b border-slate-200 px-6 lg:px-8 py-5 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Vouchers</h1>
          <p className="text-xs text-slate-500">Manage promotions, discounts, and reward vouchers</p>
        </div>
        <div className="flex gap-3">
          <Link to="/create-voucher" className="flex items-center gap-2 px-4 py-2 bg-[#10b77f] text-white rounded-lg text-sm font-medium hover:brightness-95 transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Create Voucher
          </Link>
          <Link to="/create-venue-offer" className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:brightness-95 transition-all shadow-sm">
            <Ticket className="w-4 h-4" /> New Deal 
          </Link>
        </div>
      </header>

      <div className="p-6 lg:p-8 space-y-8 w-full max-w-[1600px]">
        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsMapping.map((stat) => (
            <StatCard key={stat.id} label={stat.label} value={stat.value} Icon={stat.icon} iconColor={stat.color} />
          ))}
        </section>

        {/* Venue Offers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#10b77f] rounded-full"></span> Active Venue Vouchers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {mappedVenueOffers.map((item) => (
              <VoucherCard 
                key={item.id} 
                voucher={item} 
                onEdit={() => handleEditVoucher(item.id)}
                onClick={() => handleViewDetails(item.id)}
                onDeactivate={() => handleDeactivateClick(item.id, item.isActive)} 
                onHide={() => handleHideVenue(item.id)} // 👈 Pass the hide handler
              />
            ))}
          </div>
        </section>

        {/* Normal Vouchers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#3b82f6] rounded-full"></span> Normal Vouchers
            </h2>
          </div>
          <VouchersTable 
            vouchers={mappedNormalVouchers} 
            onEdit={handleEditVoucher}
            onView={handleViewDetails}
            onDeactivate={handleDeactivateClick} 
            onHide={handleHideNormal} // 👈 Pass the hide handler
          />
        </section>

        {/* Load More Button */}
        {hasMoreData && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={handleLoadMore}
              disabled={isFetchingMore}
              className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              {isFetchingMore ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Fetching from Server...</>
              ) : (
                <>Load More Data <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}