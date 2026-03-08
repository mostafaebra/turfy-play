import React from 'react';
import { Edit2, Ban, CheckCircle, EyeOff } from 'lucide-react'; // 👈 Import EyeOff

// 1. Make sure to receive the onHide prop here
export default function VoucherCard({ voucher, onEdit, onClick, onDeactivate, onHide }) {
  if (!voucher) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
      
      {/* 👈 NEW HIDE BUTTON: Positioned at the top right of the card */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevents triggering the card's onClick (View Details)
          onHide(); 
        }}
        className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-sm"
        title="Hide from view"
      >
        <EyeOff className="w-4 h-4" />
      </button>

      {/* Card Header / Icon area */}
      <div 
        className="p-5 pb-0 cursor-pointer" 
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${voucher.iconBg}`}>
            <voucher.icon className="w-5 h-5" />
          </div>
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${voucher.tagColor}`}>
            {voucher.tag}
          </span>
        </div>
        
        {/* Card Content */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">{voucher.title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2">{voucher.desc}</p>
        </div>
      </div>

      {/* Card Footer / Actions */}
      <div className="mt-5 border-t border-slate-100 p-3 flex justify-between items-center bg-slate-50">
        <span className="text-xs font-semibold text-slate-400">
          ID: {voucher.id}
        </span>
        
        <div className="flex gap-1">
          {/* Edit Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 text-slate-400 hover:text-[#3b82f6] hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Deactivate/Activate Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDeactivate();
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              voucher.isActive 
                ? 'text-slate-400 hover:text-red-500 hover:bg-red-100' 
                : 'text-red-400 hover:text-[#10b77f] hover:bg-green-100'
            }`}
            title={voucher.isActive ? "Deactivate" : "Activate"}
          >
            {voucher.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>                     
  );
}