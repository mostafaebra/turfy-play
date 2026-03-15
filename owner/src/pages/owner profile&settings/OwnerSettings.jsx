import React, { useState, useRef } from "react";  
import Sidebar from "../../layouts/sidebar";
import ProfileTab from "./tabs/ProfileTab";
import NotificationsTab from "./tabs/NotificationsTab";
import SecurityTab from "./tabs/SecurityTab";
import BankDetailsTab from "./tabs/BankDetailsTab";
import { FiGrid, FiCalendar, FiUsers, FiBarChart2, FiSettings, FiLogOut, FiX } from "react-icons/fi";
import { FiTarget , FiMenu } from "react-icons/fi";
export default function OwnerSettings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const tabRef = useRef();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGlobalSave = () => {
    if (activeTab === "Profile" && tabRef.current?.handleUpdateProfile) {
      tabRef.current.handleUpdateProfile();
    } 
    else if (activeTab === "Security" && tabRef.current?.handleUpdatePassword) {
      tabRef.current.handleUpdatePassword();  
    }
     
    else if (activeTab === "Notifications" && tabRef.current?.handleUpdateNotifications) {
      tabRef.current.handleUpdateNotifications();
    }
    else if (activeTab === "Bank Details" && tabRef.current?.handleUpdatePayout) {
    tabRef.current.handleUpdatePayout();  
  }
  };
  const ownerSettingsMenu = [
  { label: "Dashboard", path: "/dashboard", icon: <FiGrid size={18} /> },
  { label: "Bookings", path: "/bookings", icon: <FiCalendar size={18} /> },
  { label: "Fields", path: "/fields", icon: <FiTarget size={18} /> }, 
  { label: "Customers", path: "/customers", icon: <FiUsers size={18} /> },
  { label: "Reports", path: "/reports", icon: <FiBarChart2 size={18} /> },
];

  return (
    <div className="flex">
    <Sidebar 
      menuItems={ownerSettingsMenu} 
      businessName="Al Ahly Club"  
      isOpen={isSidebarOpen} 
      setIsOpen={setIsSidebarOpen} 
    />

      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
             <nav className="text-[10px] md:text-xs text-gray-400 mb-1 uppercase tracking-wider">Dashboard / Settings</nav>
             <h1 className="text-2xl md:text-3xl font-black text-[#1E293B]">Settings</h1>
          </div>
          <div className="lg:hidden mb-4">
  <button 
    onClick={() => setIsSidebarOpen(true)}
    className="p-2 bg-white rounded-lg border border-gray-200 text-[#1E293B] shadow-sm"
  >
    <FiMenu size={24} /> { }
  </button>
</div>
          <button 
            onClick={handleGlobalSave}
            className="w-full sm:w-auto bg-[#22C55E] text-white px-8 py-3.5 rounded-xl font-black shadow-lg shadow-green-100 hover:bg-[#1eb054] active:scale-95 transition-all text-sm"
          >
            Save Changes
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {["Profile", "Notifications", "Security", "Bank Details"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 md:px-8 py-4 text-xs md:text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab 
                ? "border-[#22C55E] text-[#1E293B]" 
                : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto animate-fadeIn">
          {activeTab === "Profile" && <ProfileTab ref={tabRef} />}
          
          { }
          {activeTab === "Notifications" && <NotificationsTab ref={tabRef} />}
          
          {activeTab === "Security" && <SecurityTab ref={tabRef} />}
          
          {activeTab === "Bank Details" && <BankDetailsTab ref={tabRef} />}
        </div>
      </main>
    </div>
  );
}