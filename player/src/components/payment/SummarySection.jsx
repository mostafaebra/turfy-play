import React from 'react';

const SummarySection = ({ basePrice, serviceFee, creditApplied }) => {
  const subtotal = Number(basePrice) + Number(serviceFee);
  const total = Math.max(0, subtotal - Number(creditApplied));

  return (
    <div className="flex flex-col gap-4 border-t border-border-light pt-6 dark:border-border-dark">
      <h2 className="text-text-light dark:text-text-dark text-xl font-semibold">Payment Summary</h2>
      <div className="space-y-2 rounded-lg bg-background-light p-4 dark:bg-background-dark/50">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Base Price</span>
          <span className="font-medium text-text-light dark:text-text-dark">{Number(basePrice).toFixed(2)} EGP</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
          <span className="font-medium text-text-light dark:text-text-dark">{Number(serviceFee).toFixed(2)} EGP</span>
        </div>
        {creditApplied > 0 && (
          <div className="flex justify-between text-sm text-primary">
            <span className="font-medium">Wallet Credit</span>
            <span className="font-medium">-{Number(creditApplied).toFixed(2)} EGP</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        <span className="text-lg font-bold">Total Due</span>
        <span className="text-2xl font-black">{total.toFixed(2)} EGP</span>
      </div>
    </div>
  );
};
export default SummarySection;