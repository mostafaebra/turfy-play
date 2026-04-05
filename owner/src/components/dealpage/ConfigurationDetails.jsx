// src/components/activedeal/ConfigurationDetails.jsx
import React from 'react';

const ConfigRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-light-gray flex items-center justify-center shrink-0 border border-border-color">
      <span className="material-symbols-outlined text-text-light">{icon}</span>
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">{label}</p>
      <p className="text-sm font-bold text-text-dark">{value}</p>
    </div>
  </div>
);

const ConfigurationDetails = ({ config }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-border-color shadow-sm font-display mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-text-dark">Configuration Details</h2>
        <button className="text-text-light hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </button>
      </div>
      
      <div className="space-y-6">
        <ConfigRow icon="percent" label="Discount Amount" value={config.discountAmount} />
        <ConfigRow icon="stadium" label="Applied Fields" value={config.appliedFields} />
        <ConfigRow icon="schedule" label="Valid Times" value={config.validTimes} />
        <ConfigRow icon="event_busy" label="Expiration Date" value={formatDate(config.expirationDate)} />
      </div>
    </div>
  );
};

export default ConfigurationDetails;