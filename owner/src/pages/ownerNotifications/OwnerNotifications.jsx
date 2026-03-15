import React, { useState, useEffect } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr"; 
import Sidebar from "../../layouts/sidebar";
import NotificationItem from "../../components/NotificationItem";
import LiveToast from "../../components/LiveToast";  
import { FiGrid, FiBarChart2, FiMenu, FiBell, FiCheck, FiClock, FiTarget, FiShield, FiTrash2 } from "react-icons/fi";

export default function OwnerNotifications() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [latestNotify, setLatestNotify] = useState(null);

  const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI0OTZiNmY4MS02NmNjLTQ1OWUtYjAzNS0wMGFjODI2ZTBlN2IiLCJ1bmlxdWVfbmFtZSI6Ik9ydmFsIFNjaGltbWVsIiwianRpIjoiNWE4ZTA2NWMtNDczZi00NzI0LTgxMTktZDhiMTlmNjZlMjhiIiwicm9sZSI6Ik93bmVyIiwibmJmIjoxNzczNTc4NDYxLCJleHAiOjE3NzM2Njg0NjEsImlhdCI6MTc3MzU3ODQ2MSwiaXNzIjoiVHVyZnlQbGF5IiwiYXVkIjoiVHVyZnlQbGF5LUZyb250In0.JataxXc9s_rLUb969y9DSkmnbWsozHgkYBUcvEctn1s";

  const ownerMenu = [
    { label: "Dashboard", path: "/dashboard", icon: <FiGrid size={20} /> },
    { label: "Schedule", path: "/schedule", icon: <FiClock size={20} /> },
    { label: "My Fields", path: "/fields", icon: <FiTarget size={20} /> },
    { label: "Finances", path: "/finances", icon: <FiBarChart2 size={20} /> },
    { label: "Loyalty Program", path: "/owner-loyalty", icon: <FiShield size={20} /> },
  ];

  useEffect(() => {
    fetchNotifications();

    // إعداد اتصال SignalR
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://turfyplaylite.runasp.net/hubs/notifications", {
        accessTokenFactory: () => AUTH_TOKEN
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (newNotification) => {
      // معالجة البيانات لضمان قراءة الحقول سواء كانت كابيتال أو سمول
      const processedNotify = {
        id: newNotification.id || newNotification.Id,
        title: newNotification.title || newNotification.Title,
        message: newNotification.message || newNotification.Message,
        notificationType: newNotification.notificationType || newNotification.NotificationType,
        isReaded: false
      };

      setNotifications((prev) => [processedNotify, ...prev]);
      setLatestNotify(processedNotify);
      setShowToast(true);
      setHasNewNotifications(true);
    });

    connection.start()
      .then(() => console.log("Connected to Hub ✅"))
      .catch(err => console.error("Connection Error: ", err));

    return () => {
      connection.stop();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://turfyplaylite.runasp.net/Turfy/GetNotificationsEndpoint/Handle", {
        headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
      });
      if (response.data.isSuccess) {
        setNotifications(response.data.data);
        setHasNewNotifications(false);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await axios.post("http://turfyplaylite.runasp.net/Turfy/MarkAllAsReadNotificationsEndpoint/Handle", {}, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
      });
      if (response.data.isSuccess) {
        setNotifications(notifications.map(n => ({ ...n, isReaded: true })));
        setHasNewNotifications(false);
      }
    } catch (error) {
      console.error("Mark All Error:", error);
    }
  };

  const handleMarkAsOpened = async (id) => {
    try {
      await axios.post("http://turfyplaylite.runasp.net/Turfy/MarkAsOpenedEndpoint/Handle", { id }, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isOpened: true, isReaded: true } : n));
    } catch (error) {
      console.error("Mark Opened Error:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete("http://turfyplaylite.runasp.net/Turfy/DeleteNotificationEndpoint/Handle", {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        data: { id }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const triggerTestNotification = async () => {
    try {
      // تم التعديل إلى POST بناءً على طبيعة الـ Endpoint
      await axios.post("http://turfyplaylite.runasp.net/api/TestTestEndpoint/TestNotifications", {}, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
      });
      console.log("Test triggered! 🚀");
    } catch (error) {
      console.error("Test trigger failed:", error);
    }
  };

  const filteredNotifications = notifications.filter(n => 
    activeFilter === "All" ? true : n.isReaded === false
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-display relative">
      <Sidebar menuItems={ownerMenu} businessName="Al Ahly Club" dark={true} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 lg:p-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white rounded-xl border border-gray-200 shadow-sm"><FiMenu size={24} /></button>
            <div>
              <nav className="text-[10px] md:text-xs text-gray-400 mb-1 uppercase tracking-[0.2em] font-black">Dashboard / Portal</nav>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-[#1E293B]">Notifications</h1>
                <div className="relative p-2 bg-white rounded-full border border-gray-100 shadow-sm">
                  <FiBell size={20} className={hasNewNotifications ? "text-[#22C55E]" : "text-gray-300"} />
                  {hasNewNotifications && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={triggerTestNotification} className="flex-1 md:flex-none px-6 py-3.5 bg-amber-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-amber-100 hover:bg-amber-600 transition-all">
              🚀 Test Live
            </button>
            <button onClick={handleMarkAllRead} className="flex-1 md:flex-none px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-xs font-black text-[#22C55E] hover:bg-gray-50 transition-all">
              <FiCheck className="inline mr-2" /> Mark All Read
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden min-h-[600px]">
          <div className="flex border-b border-gray-50 px-8 pt-6 gap-8">
            {["All", "Unread", "Bookings", "Payouts"].map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`text-sm font-black pb-5 relative transition-all ${activeFilter === filter ? "text-[#22C55E]" : "text-gray-300"}`}>
                {filter}
                {activeFilter === filter && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#22C55E] rounded-t-full"></div>}
              </button>
            ))}
          </div>

          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="py-20 text-center font-black text-[#22C55E] animate-pulse">Loading Notifications...</div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <div key={n.id} onClick={() => handleMarkAsOpened(n.id)} className="group relative cursor-pointer">
                  <NotificationItem notification={n} />
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteNotification(n.id); }} className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-32 flex flex-col items-center text-gray-200">
                <FiBell size={48} className="mb-4 opacity-20" />
                <p className="font-black italic">No notifications found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* الـ Toast يوضع خارج الـ main لضمان الظهور الصحيح */}
      {showToast && latestNotify && (
        <LiveToast notification={latestNotify} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}