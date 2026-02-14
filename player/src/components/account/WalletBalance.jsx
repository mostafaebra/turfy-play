import React from 'react';

const WalletBalance = ({ balance, loading }) => {
  return (
    <div className="bg-white rounded-xl border border-border-color p-6 md:p-8 text-center shadow-sm">
      <p className="text-base font-medium text-text-light font-display">
        Current Wallet Balance
      </p>
      
      <div className="flex items-center justify-center gap-4 mt-2">
        <span className="material-symbols-outlined text-4xl text-primary">
          account_balance_wallet
        </span>
        
        {loading ? (
          <div className="h-12 w-32 bg-light-gray animate-pulse rounded"></div>
        ) : (
          <p className="text-5xl font-extrabold text-text-dark font-display">
            {balance?.amount} {balance?.currency}
          </p>
        )}
      </div>
    </div>
  );
};

export default WalletBalance;