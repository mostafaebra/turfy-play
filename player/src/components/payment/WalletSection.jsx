import React from 'react';

const WalletSection = ({ balance, isApplied, onToggle }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-text-light dark:text-text-dark text-xl font-semibold leading-tight tracking-[-0.015em]">
          Wallet Credit
        </h2>
        <div className="flex items-center gap-2 text-secondary">
          <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}>
            account_balance_wallet
          </span>
          <p className="font-semibold text-base">Balance: {balance.toFixed(2)} EGP</p>
        </div>
      </div>
      
      <label className="flex cursor-pointer items-center justify-between rounded-lg bg-background-light p-4 dark:bg-background-dark/50">
        <span className="text-text-light dark:text-text-dark text-base font-medium">
          Apply available credit to this booking
        </span>
        <input 
          type="checkbox" 
          checked={isApplied} 
          onChange={(e) => onToggle(e.target.checked)}
          className="form-checkbox h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary"
        />
      </label>
    </div>
  );
};

export default WalletSection;