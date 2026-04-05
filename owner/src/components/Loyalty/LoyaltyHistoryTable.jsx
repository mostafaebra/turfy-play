import React from "react";

export default function LoyaltyHistoryTable({ history = [] }) {
  // دالة لتلوين حالة المكافأة بناءً على الحالة القادمة من الباك-إند
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "claimed" || s === "success") return "bg-green-50 text-green-600 border-green-100";
    if (s === "pending" || s === "ongoing") return "bg-yellow-50 text-yellow-600 border-yellow-100";
    return "bg-gray-50 text-gray-500 border-gray-100";
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-fadeInUp mb-10">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <h3 className="font-black text-xl text-[#1E293B]">Rewards History</h3>
        { }
        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
          {history?.length || 0} records found
        </span>
      </div>
      
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/20">
              {["Month", "Bookings", "Target Status", "Reward Status", "Date"].map((head) => (
                <th key={head} className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {history.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50/40 transition-all font-bold text-sm text-[#1E293B]">
                { }
                <td className="px-8 py-6">{record.monthName || "N/A"}</td>
                <td className="px-8 py-6">
                  <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs">{record.totalBookings || 0}</span>
                </td>
                <td className="px-8 py-6">
                  { }
                  {record.targetMet ? (
                    <span className="flex items-center gap-1 text-[#22C55E]">🎯 Met</span>
                  ) : (
                    <span className="text-gray-300 italic font-medium">Missed</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-tighter ${getStatusStyle(record.rewardStatus)}`}>
                    {record.rewardStatus || "No Reward"}
                  </span>
                </td>
                <td className="px-8 py-6 text-gray-400 font-medium whitespace-nowrap text-xs">
                   {record.date ? new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        { }
        {history.length === 0 && (
          <div className="py-20 text-center text-gray-300 font-bold italic">
            No history records available yet.
          </div>
        )}
      </div>
    </div>
  );
}