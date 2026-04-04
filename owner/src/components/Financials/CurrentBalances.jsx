import React from 'react';
import { DollarSign, Clock, ArrowRightLeft } from 'lucide-react';

const CurrentBalances = ({ availableBalance = 0, pendingBalance = 0, processingBalance = 0, onWithdrawClick }) => {
  return (
    <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Available Balance */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between transition-transform hover:-translate-y-1">
        <div>
          <div className="flex items-center gap-2 mb-2 text-gray-500 font-medium text-sm uppercase tracking-wider">
            <DollarSign size={20} className="text-green-500" />
            <h3>Available Balance</h3>
          </div>
          <p className="text-4xl font-extrabold text-green-600 mb-2">
            {availableBalance.toLocaleString()} EGP
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            This is the total amount you can withdraw now. It includes all completed bookings.
          </p>
        </div>
        <button 
          onClick={onWithdrawClick}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <DollarSign size={18} />
          Withdraw Funds
        </button>
      </div>

      {/* Processing Payouts */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-start transition-transform hover:-translate-y-1">
        <div className="flex items-center gap-2 mb-2 text-gray-500 font-medium text-sm uppercase tracking-wider">
          <ArrowRightLeft size={20} className="text-blue-500" />
          <h3>Processing Payouts</h3>
        </div>
        <p className="text-4xl font-extrabold text-gray-900 mb-2">
          {processingBalance.toLocaleString()} EGP
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          Funds currently being transferred. These were deducted from your available balance and are pending admin approval.
        </p>
      </div>

      {/* Future Bookings */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-start transition-transform hover:-translate-y-1">
        <div className="flex items-center gap-2 mb-2 text-gray-500 font-medium text-sm uppercase tracking-wider">
          <Clock size={20} className="text-yellow-500" />
          <h3>Future Bookings</h3>
        </div>
        <p className="text-4xl font-extrabold text-gray-900 mb-2">
          {pendingBalance.toLocaleString()} EGP
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          Funds from upcoming bookings. This balance will become available for withdrawal after the bookings are completed.
        </p>
      </div>

    </div>
  );
};

export default CurrentBalances;