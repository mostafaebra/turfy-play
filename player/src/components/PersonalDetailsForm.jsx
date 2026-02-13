import React from "react";

// أضفنا onChangeFullName لاستقبال التغييرات من المكون الأب
export default function PersonalDetailsForm({ fullName, email, phone, onChangeFullName }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 font-display">
      
      {/* Full Name - الحقل الوحيد القابل للتعديل بناءً على الـ Endpoint */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">
          Full Name
        </label>
        <input
          type="text"
          value={fullName || ""}
          onChange={(e) => onChangeFullName(e.target.value)} // تحديث الحالة عند الكتابة
          className="h-12 px-4 rounded-lg border border-gray-200 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-gray-800 transition shadow-sm"
          placeholder="Enter your full name"
        />
      </div>

      {/* Email Address - عادة لا يتغير من هذه الصفحة */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">
          Email Address
        </label>
        <input
          type="email"
          value={email || ""}
          readOnly
          className="h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Phone Number - للقراءة فقط في الوقت الحالي */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">
          Phone Number
        </label>
        <input
          type="text"
          value={phone || ""}
          readOnly
          className="h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
        />
      </div>

    </div>
  );
}