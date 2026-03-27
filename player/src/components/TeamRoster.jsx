import React from "react";
import { FiUsers, FiUserPlus } from "react-icons/fi";

export default function TeamRoster({ captain, nickname }) {
  
  const mockPlayers = [
    { name: captain, role: "Captain / Forward", img: "https://i.pravatar.cc/150?u=cap" },
    { name: "Liam Carter", role: "Midfielder", img: "https://i.pravatar.cc/150?u=liam" },
    { name: "Sophia Davis", role: "Defender", img: "https://i.pravatar.cc/150?u=sophia" },
    { name: "Ethan Foster", role: "Goalkeeper", img: "https://i.pravatar.cc/150?u=ethan" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#EBECEF] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FiUsers className="text-blue-500" size={20} />
          <h3 className="text-lg font-black text-[#1E293B]">My Team Roster: <span className="text-blue-500">{nickname}</span></h3>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {mockPlayers.map((player, index) => (
          <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
            <img src={player.img} alt={player.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
            <div>
              <p className="font-black text-[#1E293B] text-sm">{player.name}</p>
              <p className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">{player.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50/50">
        <button className="flex items-center gap-2 bg-[#22C55E] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#1DA853] transition-all active:scale-95 shadow-md">
          <FiUserPlus /> Invite Teammate
        </button>
      </div>
    </div>
  );
}