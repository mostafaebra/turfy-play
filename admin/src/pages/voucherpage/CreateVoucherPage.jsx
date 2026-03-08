import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVoucher } from '../../services/voucherapi';
import VoucherDetails from '../../components/voucher/VoucherDetails';
import UsageRestrictions from '../../components/voucher/UsageRestrictions';
import ValidityExpiration from '../../components/voucher/ValidityExpiration';

export default function CreateVoucherPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 1, // 1: Normal, 2: Special
    discountPercentage: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    limitPerUser: '',
    minBookingValue: '',
    eligibleStatus: 2, // 1: Trusted, 2: Normal, 3: Abuser
    description: '',
    isRepeated: false,
    daysOfWeek: []
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // FIX: If the field is a number but the user cleared it (value is ''), keep it as ''.
    // Otherwise, convert it to a Number.
    let parsedValue;
    if (type === 'number' || name === 'type' || name === 'eligibleStatus') {
      parsedValue = value === '' ? '' : Number(value);
    } else {
      parsedValue = value;
    }

    // Logic: Enforce Max Discount Caps immediately on change
    if (name === 'discountPercentage' && parsedValue !== '') {
      const maxAllowed = formData.type === 1 ? 100 : 50;
      if (parsedValue > maxAllowed) parsedValue = maxAllowed;
      if (parsedValue < 0) parsedValue = 0;
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    const payload = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(`${formData.endDate}T23:59:59Z`).toISOString() : null,
    };

    try {
      await createVoucher(payload);
      setStatus({ type: 'success', msg: 'Voucher created successfully!' });
      setTimeout(() => navigate('/voucher'), 1500);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Used relative min-h-screen to fix footer gaps and width overflow
    <div className="flex flex-col w-full min-h-screen font-sans bg-slate-50 relative">
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Create New Voucher</h1>
      </header>

      {/* Main Form Content */}
      <div className="flex-1 p-8 pb-10 max-w-5xl mx-auto w-full">
        {status.msg && (
          <div className={`p-4 mb-6 rounded-lg font-medium ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.msg}
          </div>
        )}

        <form id="voucher-form" onSubmit={handleSubmit} className="space-y-6">
          <VoucherDetails formData={formData} handleChange={handleChange} />
          <UsageRestrictions formData={formData} handleChange={handleChange} />
          <ValidityExpiration formData={formData} handleChange={handleChange} />
        </form>
      </div>

      {/* Sticky Footer: Stays at the bottom of the container perfectly without layout math */}
      <footer className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end items-center gap-4 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] w-full">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="px-6 py-2.5 rounded-lg font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          form="voucher-form"
          type="submit" 
          disabled={loading}
          className="px-8 py-2.5 rounded-lg font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
        >
          {loading ? 'Creating...' : 'Create Voucher'}
        </button>
      </footer>
    </div>
  );
}