import React, { useEffect } from "react";
import { FiBell, FiX } from "react-icons/fi";

export default function LiveToast({ notification, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);  
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slideInRight">
      <div className="bg-[#1E293B] text-white p-5 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-4 max-w-sm">
        <div className="w-10 h-10 bg-[#22C55E] rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-900/20">
          <FiBell size={20} />
        </div>
        <div className="flex-1 pr-4">
          <h4 className="font-black text-sm mb-1">New Update!</h4>
          <p className="text-xs text-slate-400 font-bold leading-relaxed line-clamp-2">
            {notification.title}: {notification.message}
          </p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
}