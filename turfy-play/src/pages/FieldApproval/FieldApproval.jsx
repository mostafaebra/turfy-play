import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import Sidebar from '../../components/layout/Sidebar';
import GeneralInfo from './sections/GeneralInfo';
import PhotoGallery from './sections/PhotoGallery';
import LocationMap from './sections/LocationMap';
import Amenities from './sections/Amenities';
import Pricing from './sections/Pricing';
import ActionFooter from './sections/ActionFooter';

import fieldService from '../../services/fieldService';

const FieldApproval = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [fieldData, setFieldData] = useState(null);
  const [error, setError] = useState(null);

  const taskId = id || 1; 
  const IS_NEW_REQUEST = true; 

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fieldService.getSubmission(taskId, IS_NEW_REQUEST);
        if (response.isSuccess) {
          // Initialize with empty newImages array if undefined
          setFieldData({ ...response.data, newImages: [] });
        } else {
          setError(response.message || "Failed to load data.");
        }
      } catch (err) {
        console.error(err);
        setError("Network Error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [taskId]);

  // Handle Input Changes
  const handleInputChange = (key, value) => {
    setFieldData(prev => ({ ...prev, [key]: value }));
  };

  // Handle Amenities Toggle
  const handleFacilityToggle = (bitValue) => {
    setFieldData(prev => {
        const currentMask = prev.facilities;
        const newMask = currentMask ^ bitValue;
        return { ...prev, facilities: newMask };
    });
  };

  // --- NEW: IMAGE LOGIC ---
  const handleRemoveUrl = (urlToRemove) => {
    setFieldData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== urlToRemove)
    }));
  };

  const handleRemoveNewFile = (indexToRemove) => {
    setFieldData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddFile = (file) => {
    if (!file) return;
    setFieldData(prev => ({
      ...prev,
      newImages: [...(prev.newImages || []), file]
    }));
  };
  // ------------------------

  // --- SUBMISSION LOGIC ---
  const handleSubmit = async (targetStatus = null) => {
    if (!fieldData) return;
    
    // 1. Get safe values
    const taskId = fieldData.adminTaskId || fieldData.AdminTaskId;
    const currentStatus = fieldData.requestStatus || fieldData.RequestStatus;
    const statusToSend = targetStatus !== null ? targetStatus : currentStatus;

    // 2. Time Helper
    const formatTime = (t) => {
        if (!t) return "00:00:00";
        if (t.length === 5) return t + ":00";
        return t.substring(0, 8); 
    };

    // 3. Build Safe Payload
    const payload = {
        AdminTaskId: taskId,
        RequestStatus: statusToSend,
        RequestType: fieldData.requestType ?? 0,
        Name: fieldData.name || "",
        Description: fieldData.description || "",
        DefaultPrice: fieldData.defaultPrice || 0,
        FieldSize: fieldData.fieldSize || "",
        SportType: fieldData.sportType ?? 0,
        FieldStatus: fieldData.fieldStatus ?? 0,
        SurfaceType: fieldData.surfaceType ?? 0,
        OpeningFrom: formatTime(fieldData.openingFrom || fieldData.OpeningFrom),
        OpeningUntil: formatTime(fieldData.openingUntil || fieldData.OpeningUntil),
        BookingPolicyType: fieldData.bookingPolicyType ?? 0,
        CancellationPolicy: fieldData.cancellationPolicy ?? 0,
        FieldFormat: fieldData.fieldFormat ?? 0,
        Facilities: fieldData.facilities ?? 0,
        Address: fieldData.address || "",
        Latitude: fieldData.latitude || 0,
        Longitude: fieldData.longitude || 0,
        // Send updated lists
        ImagesUrls: fieldData.imageUrls || fieldData.ImagesUrls || [],
        NewImages: fieldData.newImages || [] 
    };

    try {
        setLoading(true);
        const result = await fieldService.submitReview(payload, IS_NEW_REQUEST);
        
        if (result.isSuccess) {
            alert("Changes saved successfully!");
            navigate('/dashboard');
        } else {
            alert("Server Error: " + result.message);
        }
    } catch (err) {
        console.error("Submission Failed:", err);
        if (err.errors) {
            const msgs = Object.entries(err.errors)
                .map(([key, val]) => `${key}: ${val}`)
                .join("\n");
            alert("Validation Failed:\n" + msgs);
        } else {
            alert("Error: " + (err.title || "Submission failed"));
        }
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-500" size={40}/></div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Review & Edit Submission</h1>
        </header>

        <div className="max-w-5xl pb-12 space-y-6">
            <GeneralInfo data={fieldData} onChange={handleInputChange} />
            
            {/* UPDATED: Passing handlers for image editing */}
            <PhotoGallery 
                data={fieldData} 
                onRemoveUrl={handleRemoveUrl}
                onRemoveFile={handleRemoveNewFile}
                onAddFile={handleAddFile}
            /> 
            
            <LocationMap data={fieldData} onChange={handleInputChange} />
            <Amenities data={fieldData} onToggle={handleFacilityToggle} />
            <Pricing data={fieldData} onChange={handleInputChange} />
            
            <ActionFooter 
                onSave={() => handleSubmit(null)}     
                onApprove={() => handleSubmit(3)}     
                onReject={() => handleSubmit(2)}      
            />
        </div>
      </main>
    </div>
  );
};

export default FieldApproval;