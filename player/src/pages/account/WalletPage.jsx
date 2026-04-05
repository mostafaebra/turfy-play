import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/account/Sidebar';
import WalletBalance from '../../components/account/WalletBalance'; 
import TransactionHistory from '../../components/account/TransactionHistory';
import { getWalletBalance, getTransactions } from '../../services/walletApi'; 
import { Loader2, AlertCircle } from 'lucide-react';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [balance, setBalance] = useState(0);
  const [walletId, setWalletId] = useState(null); // <-- store walletId from first call
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterType, setFilterType] = useState('All Transactions');
  const [filterDate, setFilterDate] = useState('');

  // Step 1: Fetch wallet balance (and walletId) once on mount
  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      setError(null);
      const balanceRes = await getWalletBalance();
      if (balanceRes.data) {
        setBalance(balanceRes.data);
        setWalletId(balanceRes.data.walletId); // <-- save walletId
      } else if (balanceRes.error) {
        setError(balanceRes.error);
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);
setTransactions
  // Step 2: Fetch transactions once walletId is available, or when filters change
  useEffect(() => {
    if (!walletId) return; // wait until walletId is ready

    const fetchTransactions = async () => {
      setLoading(true);
      const transactionsRes = await getTransactions(walletId, filterType, filterDate);
      if (transactionsRes.data) {
        setTransactions(transactionsRes.data);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [walletId, filterType, filterDate]);

  return (
    <div>
      <Navbar/>
      
      <div className="flex min-h-screen bg-light-gray font-display text-text-dark">
        
        <Sidebar 
          activeTab="wallet" 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-8">
            
            {/* Header */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 -ml-2 text-slate-900 hover:bg-white rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>
              <h1 className="text-4xl font-black text-slate-900">Wallet</h1>
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-xl text-red-600 flex items-center gap-2">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12 text-emerald-600">
                <Loader2 size={32} className="animate-spin" />
              </div>
            ) : (
              <>
                <WalletBalance balance={balance} loading={loading} />

                <TransactionHistory 
                  transactions={transactions} 
                  loading={loading}
                  filter={filterType}
                  setFilter={setFilterType}
                  date={filterDate}
                  setDate={setFilterDate}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WalletPage;