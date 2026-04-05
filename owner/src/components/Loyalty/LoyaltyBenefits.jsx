import React from "react";
import { FiDollarSign, FiTrendingUp, FiBarChart } from "react-icons/fi";

export default function LoyaltyBenefits() {
  const benefits = [
    {
      title: "Guaranteed Income",
      description: "Unlock 2 guaranteed booking slots, fully paid for by Turfy Play, when you hit your monthly target.",
      icon: <FiDollarSign size={24} />,
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      title: "Top Search Ranking",
      description: "Achieve your target to earn a 'Recommended' badge and get boosted to the top of search results.",
      icon: <FiTrendingUp size={24} />,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Advanced Analytics",
      description: "Unlock premium insights and data dashboards to understand your performance and customer behavior.",
      icon: <FiBarChart size={24} />,
      color: "text-yellow-500",
      bg: "bg-yellow-50"
    }
  ];

  return (
    <div className="mb-12">
      <h3 className="font-black text-xl text-[#1E293B] mb-6">Program Benefits</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-12 h-12 ${benefit.bg} ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {benefit.icon}
            </div>
            <h4 className="font-black text-[#1E293B] mb-3">{benefit.title}</h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}