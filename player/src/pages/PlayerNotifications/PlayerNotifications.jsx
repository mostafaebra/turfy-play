import React, { useState, useEffect } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr"; 
import NotificationItem from "../../components/NotificationItem";
import LiveToast from "../../components/LiveToast";  
import { FiBell, FiCheck, FiPlay, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function PlayerNotifications() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); 
  const [showToast, setShowToast] = useState(false);
  const [latestNotify, setLatestNotify] = useState(null);

   const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI0OTZiNmY4MS02NmNjLTQ1OWUtYjAzNS0wMGFjODI2ZTBlN2IiLCJ1bmlxdWVfbmFtZSI6Ik9ydmFsIFNjaGltbWVsIiwianRpIjoiNWRiZDljNmYtYThkNS00MTE4LTkwNjItM2UzMmNkZmI2YTYwIiwicm9sZSI6Ik93bmVyIiwibmJmIjoxNzc0NTUyNjIyLCJleHAiOjE3NzQ2NDI2MjIsImlhdCI6MTc3NDU1MjYyMiwiaXNzIjoiVHVyZnlQbGF5IiwiYXVkIjoiVHVyZnlQbGF5LUZyb250In0.HLvP-ur2U8N_iaLL7s0Snp-xiGrdTB8hSVDvx5y4Pgg";

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
      if (response.data.isSuccess && response.data.data === true) fetchNotifications();
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
    } catch (error) { console.error(error); }
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
    <div className="min-h-screen bg-[#F8F9FB] font-display relative pb-10">
      { }
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-400">
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-[#1E293B]">Notifications</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={triggerTestNotification} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black hover:bg-amber-100 transition-all uppercase tracking-widest">
               <FiPlay /> Test Live
             </button>
             <button onClick={handleMarkAllRead} className="relative p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
               <FiBell size={22} className={unreadCount > 0 ? "text-[#22C55E]" : "text-gray-400"} />
               {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-lg">{unreadCount}</span>}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden min-h-[600px]">
          {/* Tabs */}
          <div className="flex border-b border-gray-50 px-8 pt-6 gap-10">
            {["All", "Unread"].map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`text-sm font-black pb-5 relative transition-all ${activeFilter === filter ? "text-[#22C55E]" : "text-gray-300"}`}>
                {filter}
                {activeFilter === filter && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#22C55E] rounded-t-full"></div>}
              </button>
            ))}
          </div>

          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="py-20 text-center font-black text-[#22C55E] animate-pulse uppercase tracking-widest">Training updates...</div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <NotificationItem 
                  key={n.id} 
                  notification={n} 
                  onOpen={() => handleMarkAsOpened(n.id)} 
                  onDelete={(id) => handleDeleteNotification(id)} 
                />
              ))
            ) : (
              <div className="py-32 flex flex-col items-center text-gray-200">
                <FiBell size={50} className="mb-4 opacity-20" />
                <p className="font-black italic text-lg text-gray-300">No new messages from the field</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showToast && latestNotify && <LiveToast notification={latestNotify} onClose={() => setShowToast(false)} />}
    </div>
  );
}