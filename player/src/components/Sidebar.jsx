import React from "react";
import { FiUser, FiCreditCard, FiFileText, FiChevronLeft } from "react-icons/fi";

export default function Sidebar() {
  const menuItems = [
    { id: "personal", label: "Personal Details", icon: <FiUser />, active: true },
    { id: "wallet", label: "Wallet", icon: <FiCreditCard />, active: false },
    { id: "bookings", label: "My Bookings & Competitions", icon: <FiFileText />, active: false },
  ];

  return (
    <aside className="w-[280px] bg-white rounded-xl border border-gray-200 p-6 font-display">
      
      {/* عنوان My Account */}
      <button className="flex items-center gap-3 text-dark font-extrabold text-2xl mb-8 hover:text-primary transition">
        <FiChevronLeft strokeWidth={3} className="text-gray-500" />
        My Account
      </button>

      {/* القائمة */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`flex items-center gap-4 px-5 py-3 rounded-xl text-sm font-medium transition ${
              item.active
                ? "bg-green-100 text-green-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span
              className={`text-lg ${
                item.active ? "text-green-600" : "text-gray-500"
              }`}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

    </aside>
  );
}
