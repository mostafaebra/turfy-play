import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import CurrentBalances from '../../components/Financials/CurrentBalances';
import WithdrawalRequests from '../../components/Financials/WithdrawalRequests';
import TransactionHistory from '../../components/Financials/TransactionHistory';
import WithdrawalModal from '../../components/Financials/WithdrawalModal';

// API Functions
import { 
  fetchBalances, 
  fetchWithdrawals, 
  fetchTransactions, 
  fetchOwnerFields, 
  requestWithdrawal 
} from '../../services/financialsApi';

const FinancialsPage = () => {
  const [fields, setFields] = useState([]); 
  const [selectedFieldId, setSelectedFieldId] = useState(null); 
  
  const [balances, setBalances] = useState({ availableBalance: 0, pendingBalance: 0 , 
    processingBalance: 0});
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Get Lists Of Field
  useEffect(() => {
    const loadFields = async () => {
      try {
        const res = await fetchOwnerFields();
        if (res?.isSuccess && res?.data?.length > 0) {
          setFields(res.data);
          setSelectedFieldId(res.data[0].fieldWalletId);
        }
      } catch (error) {
        console.error("Failed to load fields", error);
      }
    };
    loadFields();
  }, []);

  // 2. Get financial data
  const loadFinancialData = async () => {
    if (!selectedFieldId) return;

    setIsLoading(true);
    try {
      const [balancesRes, withdrawalsRes, transactionsRes] = await Promise.all([
        fetchBalances(selectedFieldId).catch(err => { console.error("Balances API failed", err); return null; }),
        fetchWithdrawals(selectedFieldId).catch(err => { console.error("Withdrawals API failed", err); return null; }),
        fetchTransactions(selectedFieldId).catch(err => { console.error("Transactions API failed", err); return null; })
      ]);

      if (balancesRes?.isSuccess) setBalances(balancesRes.data);
      if (withdrawalsRes?.isSuccess) setWithdrawals(withdrawalsRes.data.items || []);
      if (transactionsRes?.isSuccess) setTransactions(transactionsRes.data.items || []);

    } catch (error) {
      console.error("Failed to load financials data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, [selectedFieldId]);

  
  const handleWithdrawClick = () => {
    setIsModalOpen(true); 
  };

  const handleModalSubmit = async (amount, notes) => {
    try {
      await requestWithdrawal(selectedFieldId, amount, notes);
      alert("Withdrawal request submitted successfully!");
      setIsModalOpen(false);
      loadFinancialData(); 
    } catch (error) {
      alert("Failed to submit withdrawal request. Please try again.");
    }
  };

  if (isLoading && !selectedFieldId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-green-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading your fields and financials...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Financials & Payouts</h1>
          <p className="text-gray-500">Manage your balances, withdrawals, and view transaction history.</p>
        </div>
        
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Select Field</label>
          <select 
            value={selectedFieldId || ''}
            onChange={(e) => setSelectedFieldId(Number(e.target.value))}
            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block w-full sm:w-64 p-2.5 shadow-sm outline-none"
          >

            {fields.map((field) => (
              <option key={field.fieldId} value={field.fieldWalletId}>
                {field.fieldName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CurrentBalances 
        availableBalance={balances.availableBalance} 
        pendingBalance={balances.pendingBalance}
        processingBalance={balances.processingPayouts || balances.ProcessingPayouts || 0}
        onWithdrawClick={handleWithdrawClick} 
      />
      
      <WithdrawalRequests 
        requests={withdrawals} 
        onRequestNew={handleWithdrawClick} 
      />
      
      <TransactionHistory 
        transactions={transactions} 
      />

      
      <WithdrawalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit} 
        availableBalance={balances.availableBalance}
      />
    </div>
  );
};

export default FinancialsPage;