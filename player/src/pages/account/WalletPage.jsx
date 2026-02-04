import React, { useState, useEffect } from 'react';
import WalletBalance from '../../components/account/WalletBalance';
import TransactionHistory from '../../components/account/TransactionHistory';
import Sidebar from '../../components/account/Sidebar';
import Navbar from '../../components/Navbar';
import { getWalletBalance, getTransactions } from '../../services/walletApi';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('All Transactions');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const [balanceRes, transactionsRes] = await Promise.all([
        getWalletBalance(),
        getTransactions(filterType, filterDate)
      ]);

      if (balanceRes.error || transactionsRes.error) {
        setError(balanceRes.error || transactionsRes.error);
      } else {
        setBalance(balanceRes.data);
        setTransactions(transactionsRes.data);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [filterType, filterDate]);

  return (
    <div>
      <Navbar/>
      <div className="flex min-h-screen bg-light-gray font-display text-text-dark">
        
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-8">
            
            {/* Header */}
            <div className="flex items-center gap-3">
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 -ml-2 text-text-dark hover:bg-white rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>

              {/* Page Title (Restored) */}
              <h1 className="text-4xl font-black leading-tight tracking-tight text-text-dark">
                Wallet
              </h1>
            </div>

            {error && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                <span className="font-medium">Error!</span> {error}
              </div>
            )}

            <WalletBalance balance={balance} loading={loading} />

            <TransactionHistory 
              transactions={transactions} 
              loading={loading}
              filter={filterType}
              setFilter={setFilterType}
              date={filterDate}
              setDate={setFilterDate}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default WalletPage;