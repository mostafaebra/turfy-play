// src/components/activedeal/DataSections.jsx
import React from 'react';

export const RedemptionTrends = ({ trends }) => {
  const hasData = trends && trends.length > 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-border-color shadow-sm font-display mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-text-dark">Redemption Trends</h2>
          <p className="text-xs text-text-light mt-1">Daily redemptions over the last 30 days</p>
        </div>
        <div className="flex bg-light-gray p-1 rounded-lg border border-border-color">
          <button className="px-3 py-1 text-xs font-bold bg-white shadow-sm rounded-md text-text-dark">30 Days</button>
          <button className="px-3 py-1 text-xs font-bold text-text-light hover:text-text-dark">90 Days</button>
        </div>
      </div>
      
      {/* Chart Placeholder Area */}
      <div className="h-64 flex items-center justify-center border-t border-border-color pt-4 relative">
        {hasData ? (
          <div className="text-sm text-text-light">Chart rendering goes here (Requires Recharts or similar library)</div>
        ) : (
          <div className="flex flex-col items-center justify-center text-text-light">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">bar_chart</span>
            <p className="text-sm">No trend data available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const RecentRedemptions = ({ redemptions }) => {
  const hasData = redemptions && redemptions.length > 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-border-color shadow-sm font-display">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-text-dark">Recent Redemptions</h2>
        <button className="text-xs font-bold text-[#EA580C] hover:underline">
          View All Redemptions
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[10px] text-text-light uppercase tracking-wider border-b border-border-color">
              <th className="pb-3 font-bold">Player Name</th>
              <th className="pb-3 font-bold">Date & Time</th>
              <th className="pb-3 font-bold">Savings</th>
              <th className="pb-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {hasData ? (
               redemptions.map((item, idx) => (
                  <tr key={idx} className="border-b border-border-color/50 last:border-0">
                    <td className="py-4">Item Row</td>
                  </tr>
               ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-text-light">
                  <p>No recent redemptions found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};