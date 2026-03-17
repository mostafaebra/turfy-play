import React, { useState, useEffect } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr"; 
import Sidebar from "../../layouts/sidebar";
import NotificationItem from "../../components/NotificationItem";
import LiveToast from "../../components/LiveToast";  
import { FiGrid, FiMenu, FiBell, FiClock, FiTarget, FiShield, FiBarChart2, FiPlay } from "react-icons/fi";

export default function OwnerNotifications() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  
  const [unreadCount, setUnreadCount] = useState(0); 
  const [showToast, setShowToast] = useState(false);
  const [latestNotify, setLatestNotify] = useState(null);

  const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI0OTZiNmY4MS02NmNjLTQ1OWUtYjAzNS0wMGFjODI2ZTBlN2IiLCJ1bmlxdWVfbmFtZSI6Ik9ydmFsIFNjaGltbWVsIiwianRpIjoiNGFkZjg2NjUtNDczMS00N2UyLWJiNTUtOThmZjM1NmQwZmJhIiwicm9sZSI6Ik93bmVyIiwibmJmIjoxNzczNjc0MzEzLCJleHAiOjE3NzM3NjQzMTMsImlhdCI6MTc3MzY3NDMxMywiaXNzIjoiVHVyZnlQbGF5IiwiYXVkIjoiVHVyZnlQbGF5LUZyb250In0.GvuE9c6nJIpjBYtpL7MZVnwxWC0SFgRE0A71DUkRHZ8";

  
  const ownerMenu = [
    { label: "Dashboard", path: "/dashboard", icon: <FiGrid size={20} /> },
    { label: "Schedule", path: "/schedule", icon: <FiClock size={20} /> },
    { label: "My Fields", path: "/fields", icon: <FiTarget size={20} /> },
    { label: "Finances", path: "/finances", icon: <FiBarChart2 size={20} /> },
    { label: "Loyalty Program", path: "/owner-loyalty", icon: <FiShield size={20} /> },
  ];

  useEffect(() => {
    fetchNotifications();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://turfyplaylite.runasp.net/hubs/notifications", {
        accessTokenFactory: () => AUTH_TOKEN
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNewMessage", (data) => {
      const processedNotify = {
        id: data.id || data.Id || Date.now(),
        title: data.title || data.Title,
        message: data.message || data.Message,
        isReaded: false
      };
      setNotifications((prev) => [processedNotify, ...prev]);
      setUnreadCount(prev => prev + 1); 
      setLatestNotify(processedNotify);
      setShowToast(true);
    });

    connection.start().catch(err => console.error(err));
    const interval = setInterval(checkNewNotifications, 60000); 

    return () => {
      connection.stop();
      clearInterval(interval);
    };
  }, []);

  const checkNewNotifications = async () => {
    try {
      const response = await axios.get("http://turfyplaylite.runasp.net/Turfy/IsThereNewNotificationEndpoint/Handle", {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
      });
      if (response.data.isSuccess && response.data.data === true) {
        fetchNotifications();
      }
    } catch (error) { console.error(error); }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://turfyplaylite.runasp.net/Turfy/GetNotificationsEndpoint/Handle", {
        headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
      });
      if (response.data.isSuccess) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter(n => !n.isReaded).length);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.post("http://turfyplaylite.runasp.net/Turfy/MarkAllAsReadNotificationsEndpoint/Handle", {}, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
      });
      setNotifications(notifications.map(n => ({ ...n, isReaded: true })));
      setUnreadCount(0);
    } catch (error) { console.error(error); }
  };

  const handleMarkAsOpened = async (id) => {
    try {
      await axios.post(`http://turfyplaylite.runasp.net/Turfy/MarkAsOpenedEndpoint/Handle?id=${id}`, {}, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isReaded: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Mark Opened Error:", error.response?.data);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete("http://turfyplaylite.runasp.net/Turfy/DeleteNotificationEndpoint/Handle", {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        data: { id }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) { console.error(error); }
  };

  const triggerTestNotification = async () => {
    try {
      await axios.post("http://turfyplaylite.runasp.net/api/TestTestEndpoint/TestNotifications", {}, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
      });
    } catch (error) { console.error(error); }
  };

  const filteredNotifications = notifications.filter(n => 
    activeFilter === "All" ? true : n.isReaded === false
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-display relative">
      { }
      <Sidebar 
        menuItems={ownerMenu} 
        businessName="Al Ahly Club" 
        dark={true} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 lg:p-12">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            { }
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 bg-white rounded-xl border border-gray-200 shadow-sm"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-3xl font-black text-[#1E293B]">Notifications</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={triggerTestNotification} className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black hover:bg-amber-100 transition-all uppercase tracking-widest">
              <FiPlay className="inline mr-1" /> Test Live
            </button>
            <button onClick={handleMarkAllRead} className="relative p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <FiBell size={24} className={unreadCount > 0 ? "text-[#22C55E]" : "text-gray-400"} />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-lg">{unreadCount}</span>}
            </button>
          </div>
        </div>

        { }
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden min-h-[600px]">
          <div className="flex border-b border-gray-50 px-8 pt-6 gap-10">
            {["All", "Unread"].map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`text-sm font-black pb-5 relative transition-all ${activeFilter === filter ? "text-[#22C55E]" : "text-gray-300"}`}>{filter}{activeFilter === filter && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#22C55E] rounded-t-full"></div>}</button>
            ))}
          </div>
          <div className="divide-y divide-gray-50">
            {filteredNotifications.map((n) => (
              <NotificationItem 
                key={n.id} 
                notification={n} 
                onOpen={() => handleMarkAsOpened(n.id)} 
                onDelete={(id) => handleDeleteNotification(id)} 
              />
            ))}
          </div>
        </div>
      </main>

      {showToast && latestNotify && <LiveToast notification={latestNotify} onClose={() => setShowToast(false)} />}
    </div>
  );
}