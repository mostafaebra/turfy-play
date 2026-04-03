import React from 'react';
import { Plus } from 'lucide-react';

const WithdrawalRequests = ({ requests = [], onRequestNew }) => {
  

  const validRequests = requests.filter(req => Math.abs(req.amount) >= 500);


  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-bold">Approved</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-bold">Pending</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold">Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-bold">{status}</span>;
    }
  };

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Withdrawal Requests</h2>
          <p className="text-sm text-gray-500">Minimum withdrawal amount: 500 EGP.</p>
        </div>
        <button 
          onClick={onRequestNew}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          Request New Withdrawal
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-b-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {validRequests.map((req, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(req.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-bold">
                    {Math.abs(req.amount).toLocaleString()} EGP
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {req.transactionId || "#N/A"}
                  </td>
                </tr>
              ))}

              {validRequests.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                    No withdrawal requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequests;