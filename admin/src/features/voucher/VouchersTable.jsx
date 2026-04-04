import React from 'react';
import { Edit2, Ban, CheckCircle, EyeOff } from 'lucide-react'; // 👈 Import EyeOff

export default function VouchersTable({ vouchers, onEdit, onView, onDeactivate, onHide }) {
  
  if (!vouchers || vouchers.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
        No normal vouchers found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="p-4">Voucher Code</th>
              <th className="p-4">Type</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Description</th>
              <th className="p-4">Last Modified</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vouchers.map((voucher) => (
              <tr key={voucher.dbId} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4">
                  <button onClick={() => onView(voucher.dbId)} className="font-bold text-slate-800 hover:text-[#3b82f6] transition-colors">
                    {voucher.id}
                  </button>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    voucher.type === 'TRUSTED' ? 'bg-[#10b77f]/10 text-[#10b77f]' :
                    voucher.type === 'ABUSER' ? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {voucher.type}
                  </span>
                </td>
                <td className="p-4 font-semibold text-slate-700">{voucher.percent}</td>
                <td className="p-4 text-sm text-slate-500 truncate max-w-[200px]">{voucher.desc}</td>
                <td className="p-4 text-sm text-slate-500">{voucher.date}</td>
                
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    <button onClick={() => onEdit(voucher.dbId)} className="p-1.5 text-slate-400 hover:text-[#3b82f6] hover:bg-blue-50 rounded-lg transition-colors" title="Edit Voucher">
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button onClick={() => onDeactivate(voucher.dbId, voucher.isActive)} className={`p-1.5 rounded-lg transition-colors ${voucher.isActive ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-red-400 hover:text-[#10b77f] hover:bg-green-50'}`} title={voucher.isActive ? "Deactivate Voucher" : "Activate Voucher"}>
                      {voucher.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>

                    {/* 👈 NEW HIDE BUTTON */}
                    <button 
                      onClick={() => onHide(voucher.dbId)} 
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" 
                      title="Hide from view"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}