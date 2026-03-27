import React from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";

export default function NotificationItem({ notification, onOpen, onDelete }) {
  return (
    <div className={`p-6 flex items-center justify-between transition-all relative group border-l-4 
      ${!notification.isReaded ? "bg-[#22C55E]/5 border-[#22C55E]" : "bg-white hover:bg-gray-50/50 border-transparent"}`}>
      
      <div className="flex-1 pr-6 cursor-pointer" onClick={onOpen}>
        <h4 className={`text-sm md:text-base transition-colors ${!notification.isReaded ? "font-black text-[#1E293B]" : "font-bold text-gray-400"}`}>
          {notification.title}
        </h4>
        <p className={`text-sm mt-0.5 line-clamp-2 ${!notification.isReaded ? "text-gray-600 font-bold" : "text-gray-400 font-medium"}`}>
          {notification.message}
        </p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
        <button onClick={onOpen} className="p-2.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#22C55E] hover:shadow-sm shadow-sm" title="Mark as Read">
          <FiEye size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }} className="p-2.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 hover:shadow-sm shadow-sm" title="Delete">
          <FiTrash2 size={16} />
        </button>
      </div>

      <span className="text-[9px] text-gray-300 font-black uppercase ml-4 group-hover:hidden whitespace-nowrap italic">
        Recent
      </span>
    </div>
  );
}