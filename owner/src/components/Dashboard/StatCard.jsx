import React from 'react';

const StatCard = ({ title, value, subtext }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900">
        {value} <span className="text-lg font-medium text-gray-600">{subtext}</span>
      </p>
    </div>
  );
};

export default StatCard;