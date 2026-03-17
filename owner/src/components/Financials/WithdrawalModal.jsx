import React, { useState } from 'react';
import { X } from 'lucide-react';

const WithdrawalModal = ({ isOpen, onClose, onSubmit, availableBalance }) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    
    if (numAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (numAmount < 500) {
      setError('The minimum withdrawal amount is 500 EGP.');
      return;
    }
    
    if (numAmount > availableBalance) {
      setError('Amount exceeds your available balance.');
      return;
    }

    
    onSubmit(numAmount, notes);
    
    setAmount('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Request Withdrawal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Request Withdrawal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <X size={24} />
          </button>
        </div>


        <form onSubmit={handleSubmit} className="p-5">
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="text-sm font-bold text-gray-700">Amount (EGP)</label>
              <span className="text-xs text-gray-500">Available: {availableBalance} EGP</span>
            </div>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 5000"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Transfer Notes / Details</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Vodafone Cash number or Bank Account details"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none h-24"
            ></textarea>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition"
            >
              Submit Request
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default WithdrawalModal;