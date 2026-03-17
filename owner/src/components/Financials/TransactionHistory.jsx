import React, { useState } from 'react';

const TransactionHistory = ({ transactions }) => {

  const [filterType, setFilterType] = useState('All');

  
  const filteredTransactions = transactions.filter((transaction) => {
    const typeValue = transaction.type || transaction.transactionType;
    
    
    if (typeValue === 'Payout' && Math.abs(transaction.amount) < 500) {
      return false; 
    }

    if (filterType === 'All') return true;
    return typeValue === filterType;
  });


  const getTypeStyles = (type) => {
    switch (type) {
      case 'Booking':
        return 'bg-green-100 text-green-700';     
      case 'Payout':
        return 'bg-red-100 text-red-700';         
      case 'LoyaltyBonus':
        return 'bg-blue-100 text-blue-700';       
      case 'Refund':
        return 'bg-yellow-100 text-yellow-800';   
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
        
        {/* Filter List */}
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-lg p-2.5 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto cursor-pointer"
        >
          <option value="All">All Transactions</option>
          <option value="Booking">Bookings</option>
          <option value="Payout">Payouts</option>
          <option value="LoyaltyBonus">Loyalty Bonuses</option>
          <option value="Refund">Refunds</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="p-4 font-semibold rounded-tl-lg">Date</th>
              <th className="p-4 font-semibold">Description / ID</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold text-right rounded-tr-lg">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((item, index) => {
                const typeValue = item.type || item.transactionType; 

                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-900 font-medium">
                      {item.description || item.transactionId || "#N/A"}
                    </td>
                    <td className="p-4">

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeStyles(typeValue)}`}>
                        {typeValue}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-right text-gray-900">
                      <span className={typeValue === 'Payout' || typeValue === 'Refund' ? 'text-red-500 mr-1' : 'text-green-500 mr-1'}>
                        {typeValue === 'Payout' || typeValue === 'Refund' ? '-' : '+'}
                      </span>
                      {Math.abs(item.amount)} EGP
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500 bg-gray-50 rounded-b-lg">
                  No transactions found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;