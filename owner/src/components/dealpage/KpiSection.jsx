
// src/components/activedeal/KpiSection.jsx
import React from 'react';

const KpiCard = ({ icon, color, title, value, change, isPositive, extra }) => (
  <div className="bg-white p-6 rounded-2xl border border-border-color shadow-sm flex flex-col justify-between h-full font-display">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      {change && (
        <span className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
      )}
      {extra && <span className="text-xs text-text-light">{extra}</span>}
    </div>
    <div>
      <h3 className="text-xs font-bold text-text-light mb-1">{title}</h3>
      <p className="text-3xl font-black text-text-dark">{value}</p>
    </div>
  </div>
);

const KpiSection = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KpiCard 
        icon="bar_chart" 
        color="bg-blue-100 text-blue-600"
        title="Total Redemption Rate" 
        value={`${kpis?.redemptionRate || 0}%`}
        change="0.0" 
        isPositive={true}
      />
      <KpiCard 
        icon="payments" 
        color="bg-green-100 text-green-600"
        title="Revenue Generated" 
        value={`$${(kpis?.revenueGenerated || 0).toFixed(2)}`}
        change="0.0" 
        isPositive={true}
      />
      <KpiCard 
        icon="person_add" 
        color="bg-orange-100 text-orange-600"
        title="New Customer Conv." 
        value={`${kpis?.newCustomerConversion || 0}%`}
        change="0.0"
        isPositive={false}
      />
      {/* Fallback card for missing API data to match the UI layout */}
      <KpiCard 
        icon="star" 
        color="bg-yellow-100 text-yellow-600"
        title="Avg. Deal Rating" 
        value="0.0" 
        extra="0 reviews"
      />
    </div>
  );
};

export default KpiSection;