import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuaranteeProgress = ({ current, target, rewardText }) => {
  const navigate = useNavigate();
  const progressPercentage = (current / target) * 100;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Booking Guarantee Progress</h2>
        <span className="text-sm font-medium text-gray-600">{current}/{target}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
        <div 
          className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{rewardText}</p>
        <button 
          onClick={() => navigate('/loyalty')} // 👈 هيروح لصفحة الولاء
          className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default GuaranteeProgress;