import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/account/Sidebar';
// You likely have these components, if not I can provide placeholders
import WalletBalance from '../../components/account/WalletBalance'; 
import TransactionHistory from '../../components/account/TransactionHistory';
import { getWalletBalance, getTransactions } from '../../services/walletApi'; 
import { Loader2, AlertCircle } from 'lucide-react';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [filterType, setFilterType] = useState('All Transactions');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Balance and Transactions parallel
        const [balanceRes, transactionsRes] = await Promise.all([
          getWalletBalance(),
          getTransactions(filterType, filterDate)
        ]);

        if (balanceRes.isSuccess) {
            setBalance(balanceRes.data);
        }
        
        if (transactionsRes.isSuccess) {
            setTransactions(transactionsRes.data);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load wallet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterType, filterDate]);

  return (
    <div>
      <Navbar/>
      
      <div className="flex min-h-screen bg-light-gray font-display text-text-dark">
        
        {/* Sidebar with correct active tab */}
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

              <h1 className="text-4xl font-black text-slate-900">
                Wallet
              </h1>
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
                    {/* Render Components if they exist, otherwise show placeholders */}
                    {WalletBalance ? (
                        <WalletBalance balance={balance} loading={loading} />
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold">Balance: {balance} EGP</h2>
                        </div>
                    )}

                    {TransactionHistory ? (
                        <TransactionHistory 
                            transactions={transactions} 
                            loading={loading}
                            filter={filterType}
                            setFilter={setFilterType}
                            date={filterDate}
                            setDate={setFilterDate}
                        />
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold mb-4">Transactions</h3>
                            <p className="text-gray-500">No transaction history component found.</p>
                        </div>
                    )}
                </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WalletPage;