import React, { memo } from 'react';

const StatCard = memo(({ label, value, Icon, iconColor }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start">
      <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</span>
      <Icon className={`${iconColor} w-5 h-5`} />
    </div>
    <p className="text-2xl font-bold mt-2 text-slate-800">{value}</p>
  </div>
));

export default StatCard;