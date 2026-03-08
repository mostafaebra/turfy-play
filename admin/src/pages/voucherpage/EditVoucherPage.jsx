import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GeneralInformation from '../../components/voucher/GeneralInformation';
import EditValidityExpiration from '../../components/voucher/EditValidityExpiration';
import ConfirmationModal from '../../components/voucher/ConfirmationModal'; // 👈 Import the modal

import { editVoucher, getVoucherById, deleteVoucher } from '../../services/voucherapi'; 

const EditVoucherPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '', name: "", code: "", type: 1, discountPercentage: 0,
    maxDiscountAmount: 0, startDate: "", endDate: "", usageLimit: 0,
    limitPerUser: 1, minBookingValue: 0, eligibleStatus: 1, isRepeated: false, description: ""
  });

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 👈 New State for Modal Visibility
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchVoucherData = async () => {
      try {
        setIsPageLoading(true);
        const data = await getVoucherById(id);
        setFormData(prev => ({
          ...prev, ...data,
          startDate: data.startDate || "", endDate: data.endDate || ""
        }));
      } catch (err) {
        setErrorMsg(err.message || "Could not load voucher data.");
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchVoucherData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    if (type === 'number' || name === 'type' || name === 'eligibleStatus') {
      parsedValue = value === '' ? '' : Number(value);
    } else if (type === 'date') {
      parsedValue = new Date(value).toISOString();
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleToggle = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleSubmit = async () => {
    if (formData.discountPercentage > 100) {
      setErrorMsg("Discount percentage cannot exceed 100%.");
      return;
    }
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      setErrorMsg("End date cannot be before start date.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = { ...formData, id: Number(id) };
      
      // 1. Capture the response from your API
      const result = await editVoucher(payload);

      // 2. Explicitly check if the backend flagged it as a failure
      if (result && result.isSuccess === false) {
        throw new Error(result.message || "Validation failed. Please check your inputs.");
      }

      // 3. Only show success if it passed the check
      setSuccessMsg("Voucher updated successfully!");
      setTimeout(() => navigate('/voucher'), 1500);
      
    } catch (error) {
      // 4. This will now properly catch the backend's custom error message
      setErrorMsg(error.message || "Failed to update voucher. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // 👈 NEW: The actual delete logic triggered BY THE MODAL
  const executeDelete = async () => {
    setIsDeleting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await deleteVoucher(id);
      setIsModalOpen(false); // Close modal on success
      setSuccessMsg("Voucher deleted successfully!");
      setTimeout(() => navigate('/voucher'), 1000);
    } catch (error) {
      setErrorMsg(error.message || "Failed to delete voucher. Please try again.");
      setIsDeleting(false); 
      setIsModalOpen(false); // Close modal so they can see the error
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex-1 p-8 bg-[#F4F6F8] min-h-screen flex items-center justify-center">
        <div className="text-gray-500 font-medium animate-pulse">Loading voucher details...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-[#F4F6F8] min-h-screen relative">
      
      {/* Custom Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Voucher?"
        message={`Are you sure you want to delete "${formData.code || id}"? This action cannot be undone and will remove it permanently.`}
        isProcessing={isDeleting}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          Offers & Vouchers <span className="mx-2">&gt;</span> Edit Voucher
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-4">
              Edit Voucher: {formData.code || `ID-${id}`}
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-[#00B573] rounded-full border border-green-200">
                Active
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage voucher details and validity settings.</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 flex items-center gap-2 text-sm font-medium">
            <span>🔙</span> Go Back
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">{errorMsg}</div>}
      {successMsg && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-200">{successMsg}</div>}

      {/* Form Content */}
      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="flex-1">
          <GeneralInformation formData={formData} handleInputChange={handleInputChange} />
        </div>
        <div className="w-full lg:w-[350px]">
          <EditValidityExpiration formData={formData} handleInputChange={handleInputChange} handleToggle={handleToggle} />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <span>⚙️</span> ID: {id}
        </div>
        <div className="flex items-center gap-4">
          
          {/* 👈 UPDATED: Delete Button now opens the modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={isSaving}
            className="text-red-500 font-medium px-4 hover:bg-red-50 py-2 rounded transition-colors flex items-center gap-2"
          >
            <span className="text-xl leading-none">🗑️</span> Delete Voucher
          </button>
          
          <div className="w-px h-6 bg-gray-200"></div>
          
          <button 
            onClick={() => navigate(-1)}
            disabled={isSaving}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`px-6 py-2 bg-[#00B573] hover:bg-[#009c63] text-white rounded-lg font-medium transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default EditVoucherPage;