import React from "react";

export default function PaymentSummary({ price, fees, discount, total, method }) {
  return (
    <div className="flex flex-col gap-6 font-display">
      {/* Title with Border Bottom */}
      <h3 className="text-dark font-bold text-lg border-b border-border-color pb-2">
        Payment Summary
      </h3>

      <div className="bg-light-gray/30 rounded-xl p-6 border border-border-color flex flex-col gap-4">
        
        {/* Field Price */}
        <div className="flex justify-between text-sm">
          <span className="text-[#64748B] font-medium">Field Price</span>
          <span className="text-dark font-bold">{price} EGP</span>
        </div>
        
        {/* Service Fees */}
        <div className="flex justify-between text-sm">
          <span className="text-[#64748B] font-medium">Service Fee</span>
          <span className="text-dark font-bold">{fees} EGP</span>
        </div>

        {/* Coupon Discount (Only visible if > 0) */}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-primary font-bold">
            <span>Coupon Applied</span>
            <span>-{discount} EGP</span>
          </div>
        )}

        {/* Total Price Section */}
        <div className="border-t border-border-color pt-4 flex justify-between items-center">
          <span className="text-text-dark font-bold text-base">Total Paid</span>
          <span className="text-text-dark font-black text-xl">{total} EGP</span>
        </div>

        {/* Payment Method Footer */}
        <div className="text-[10px] text-text-light uppercase tracking-widest mt-2">
          Paid via: {method || "Credit Card"}
        </div>
      </div>
    </div>
  );
}