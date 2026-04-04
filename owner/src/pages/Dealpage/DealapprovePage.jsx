import React, { useState, useEffect } from 'react';

import { fetchDealDetails, updateDealStatus } from '../../services/dealpageapi';
import DealHeader from '../../components/dealpage/DealHeader';
import DealRules from '../../components/dealpage/DealRules';
import SubmissionNote from '../../components/dealpage/SubmissionNote';
import PlayerAppPreview from '../../components/dealpage/PlayerAppPreview';
import { useParams, useNavigate } from 'react-router-dom'; // <-- Added useNavigate


const DealPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  
  const [dealData, setDealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    if (!id) {
      setError("No deal ID provided.");
      setLoading(false);
      return;
    }

    const getDeal = async () => {
      try {
        setLoading(true);
        const response = await fetchDealDetails(id);
        
        if (!response.isSuccess || !response.data) {
          throw new Error("Invalid response format");
        }

        const apiData = response.data;

        // --- NEW ROUTING LOGIC ---
        // Adjust these numbers based on your actual backend Enums
       const STATUS_PENDING = 1; 
        const STATUS_REJECTED = 2;
        const STATUS_APPROVED = 3; 
        const STATUS_CANCELLED = 4;

        if (apiData.requestStatus === STATUS_APPROVED) {
          // If the deal is already approved, instantly route to Active Deal
          navigate(`/ActiveDealPage/${id}`, { replace: true });
          return; 
        }

        // Date formatting helpers
        const formatDate = (dateString) => {
          if (!dateString) return "N/A";
          return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          });
        };

        // Mapping your actual API payload to the Component props
        const mappedData = {
          id: id,
          venueOfferId: apiData.requestId || apiData.voucherId, 
          title: apiData.name || apiData.code || "Unnamed Deal",
          code: apiData.code,
          description: apiData.description,
          discountRate: Math.round(apiData.discountPercentage), 
          discountType: "PERCENTAGE", 
          requestStatus: apiData.requestStatus, // Save status to show pending vs rejected
          isActive: apiData.isActive,
          
          // Fallbacks for UI
          submittedBy: "Turfy Partner", 
          date: formatDate(apiData.startDate), 
          fields: [`Field ID: ${apiData.fieldId}`],
          timeWindow: "All Day", 
          timeWindowShort: "All Day", 
          expirationDate: formatDate(apiData.endDate),
          expirationShort: formatDate(apiData.endDate), 
          conditions: [
            `Minimum booking value: ${apiData.minBookingValue} AED/SAR`,
            `Use promotional code: ${apiData.code}`,
            "Cannot be combined with other ongoing promotions."
          ],
          note: "No additional notes provided by manager.",
          imageUrl: null 
        };

        setDealData(mappedData);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };

    getDeal();
  }, [id, navigate]); // Add navigate to dependency array

  const handleDealAction = async (isApproved) => {
    try {
      setIsProcessingAction(true);
      
      const payload = {
        id: dealData.id, 
        venueOfferId: dealData.venueOfferId, 
        approve: isApproved
      };

      await updateDealStatus(payload);
      
      showToast(`Success! The deal has been ${isApproved ? 'approved' : 'rejected'}.`, 'success');
      
      // If they just approved it, automatically route them to the active deal page after a short delay
      if (isApproved) {
        setTimeout(() => {
          navigate(`/deals/active/${id}`);
        }, 1500);
      } else {
        // If rejected, just reload the data so the status badge updates to "Rejected"
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
      
    } catch (err) {
      console.error(err);
      showToast("We couldn't save your decision just now. Please check your internet connection and try again.", 'error');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-light-gray font-display">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-light-gray font-display text-text-dark px-4 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
          <span className="material-symbols-outlined text-4xl text-red-400">cloud_off</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">We hit a small snag</h2>
        <p className="text-text-light max-w-sm mb-8 leading-relaxed">
          We're having trouble pulling up the details for this deal right now. It might just be a temporary connection hiccup.
        </p>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all">
          <span className="material-symbols-outlined text-sm">refresh</span>
          Refresh Page
        </button>
      </div>
    );
  }

  // 3. Main Render
  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto bg-light-gray relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl font-display text-sm font-bold animate-fade-in-down transition-all ${
          toast.type === 'success' ? 'bg-primary text-white' : 'bg-red-500 text-white'
        }`}>
          <span className="material-symbols-outlined">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {toast.message}
        </div>
      )}

      {/* Header omitted for brevity... */}

      <div className="p-8 max-w-6xl mx-auto w-full">
        <DealHeader 
          title={dealData.title}
          submittedBy={dealData.submittedBy}
          date={dealData.date}
          onAction={handleDealAction}
          isProcessing={isProcessingAction}
          status={dealData.requestStatus} // <-- Passing status so Header can show "Rejected" or "Pending"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DealRules data={dealData} />
            <SubmissionNote note={dealData.note} />
          </div>
          <div className="lg:col-span-1">
            <PlayerAppPreview data={dealData} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DealPage;