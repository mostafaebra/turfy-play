import React from "react";
import { FiCreditCard, FiCheckCircle } from "react-icons/fi";

export default function PaymentSummary({ price, fees, discount, total, method }) {
  return (
    <div className="flex flex-col gap-5 font-sans">
      {/* العنوان بستايل الصورة الجديد */}
      <h3 className="text-lg font-black text-[#1E293B] border-b border-[#F1F2F4] pb-3 tracking-tight">
        Payment Summary
      </h3>

      <div className="bg-white rounded-2xl p-6 border border-[#F1F2F4] flex flex-col gap-4 shadow-sm">
        
        {/* سعر الملعب */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 font-bold">Field Price</span>
          <span className="text-[#1E293B] font-black">{price} EGP</span>
        </div>
        
        {/* مصاريف الخدمة */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 font-bold">Service Fee</span>
          <span className="text-[#1E293B] font-black">{fees} EGP</span>
        </div>

        {/* الكوبون (بيظهر بس لو فيه خصم فعلاً) */}
        {discount > 0 && (
          <div className="flex justify-between items-center text-sm px-3 py-2 bg-green-50 rounded-lg border border-green-100 animate-fadeIn">
            <span className="text-[#22C55E] font-black flex items-center gap-2">
              <FiCheckCircle size={14} /> Coupon Discount
            </span>
            <span className="text-[#22C55E] font-black">-{discount} EGP</span>
          </div>
        )}

        {/* الإجمالي المكتوب بخط تقيل وواضح (Total Paid) */}
        <div className="border-t border-[#F1F2F4] pt-5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[#1E293B] font-black text-base uppercase tracking-wider">Total Paid</span>
            {/* طريقة الدفع تحت الإجمالي بشكل شيك */}
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.1em] mt-1 flex items-center gap-1">
              <FiCreditCard size={12} /> {method || "Digital Payment"}
            </span>
          </div>
          <span className="text-[#22C55E] font-black text-2xl tracking-tight leading-none">
            {total} <span className="text-xs">EGP</span>
          </span>
        </div>
      </div>
    </div>
  );
}