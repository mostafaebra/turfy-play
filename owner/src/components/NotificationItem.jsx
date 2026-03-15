import React from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiCreditCard, FiStar } from "react-icons/fi";

export default function NotificationItem({ notification }) {
  // دالة تحديد الثيم بناءً على النوع
  const getIcon = (type) => {
    switch (type) {
      case 8: // Bookings
        return { icon: <FiCheckCircle size={20} />, bg: "bg-green-50", text: "text-green-600", btnLabel: "View Booking" };
      case 9: // Payment Failures
        return { icon: <FiAlertCircle size={20} />, bg: "bg-red-50", text: "text-red-600", btnLabel: "Check Wallet" };
      case 10: // Payouts
        return { icon: <FiCreditCard size={20} />, bg: "bg-blue-50", text: "text-blue-600", btnLabel: "View Payout" };
      case 11: // Loyalty
        return { icon: <FiStar size={20} />, bg: "bg-yellow-50", text: "text-yellow-600", btnLabel: "Loyalty Program" };
      default:
        return { icon: <FiInfo size={20} />, bg: "bg-slate-50", text: "text-slate-600", btnLabel: "View Details" };
    }
  };

  // تأكدي أن الحقل يقرأ بالسمول كما في الكونسول
  const theme = getIcon(notification.notificationType);

  return (
    <div className={`p-6 flex items-start gap-5 border-b border-gray-50 transition-all relative group
      ${!notification.isReaded ? "bg-blue-50/40 border-l-4 border-[#22C55E]" : "bg-white hover:bg-gray-50/80"}`}>
      
      {/* Icon Container */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${theme.bg} ${theme.text}`}>
        {theme.icon}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center">
          {/* تمييز العنوان بناءً على isReaded */}
          <h4 className={`text-sm md:text-base transition-colors ${!notification.isReaded ? "font-black text-[#1E293B]" : "font-bold text-gray-500"}`}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap ml-4">
            Just now
          </span>
        </div>
        
        {/* محتوى الرسالة - استخدام isReaded للتمييز البصري */}
        <p className={`text-sm leading-relaxed max-w-[90%] ${!notification.isReaded ? "text-gray-600 font-bold" : "text-gray-400 font-medium"}`}>
          {notification.message}
        </p>
        
        {/* الزر التفاعلي */}
        <div className="pt-2">
          <button className={`px-5 py-2 border rounded-xl text-[11px] font-black transition-all shadow-sm
            ${!notification.isOpened ? "bg-white border-gray-200 text-[#1E293B] hover:border-[#22C55E] active:scale-95" : "bg-gray-50 border-transparent text-gray-400"}`}>
            {theme.btnLabel}
          </button>
        </div>
      </div>

      {/* نقطة التنبيه الحمراء للإشعارات غير المقروءة */}
      {!notification.isReaded && (
        <div className="absolute right-6 top-8">
           <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse"></div>
        </div>
      )}

      {/* أيقونة "تم الفتح" تظهر بجانب النص */}
      {notification.isOpened && (
        <div className="absolute right-6 bottom-6 opacity-30">
          <FiCheckCircle size={14} className="text-[#22C55E]" />
        </div>
      )}
    </div>
  );
}