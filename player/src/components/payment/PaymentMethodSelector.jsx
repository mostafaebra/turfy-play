import React from 'react';

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-text-light dark:text-text-dark text-xl font-semibold">Select Payment Method</h2>
      <div className="space-y-3">
        {['card', 'digital_wallet', 'fawry'].map((method) => (
          <label key={method} className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all ${selectedMethod === method ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-border-light dark:border-border-dark'}`}>
            <div className="flex items-center gap-4">
              <input 
                type="radio" 
                name="payment_method" 
                checked={selectedMethod === method} 
                onChange={() => onSelect(method)}
                className="form-radio h-5 w-5 text-primary focus:ring-primary" 
              />
              <span className="font-semibold capitalize text-text-light dark:text-text-dark">
                {method === 'digital_wallet' ? 'Digital Wallets' : method === 'card' ? 'Credit / Debit Card' : 'Fawry'}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
export default PaymentMethodSelector;