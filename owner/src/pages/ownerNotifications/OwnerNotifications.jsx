import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr"; 
import NotificationItem from "../../components/Notifications/NotificationItem";
import LiveToast from "../../components/Notifications/LiveToast";  
import { FiBell, FiPlay } from "react-icons/fi";


import { 
  fetchNotifications, 
  checkNewNotifications, 
  markAllAsRead, 
  markAsOpened, 
  deleteNotification, 
  triggerTestNotification 
} from "../../services/notificationsApi";
import { BASE_URL } from "../../config";

export default function OwnerNotifications() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); 
  const [showToast, setShowToast] = useState(false);
  const [latestNotify, setLatestNotify] = useState(null);

  useEffect(() => {
    loadNotifications();


    const token = localStorage.getItem("token");
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/notifications`, {})
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNewMessage", (data) => {
      const processedNotify = {
        id: data.id || data.Id || Date.now(),
        title: data.title || data.Title,
        message: data.message || data.Message,
        isReaded: false
      };
      setNotificationsList((prev) => [processedNotify, ...prev]);
      setUnreadCount(prev => prev + 1); 
      setLatestNotify(processedNotify);
      setShowToast(true);
    });

    connection.start().catch(err => console.error("SignalR Connection Error:", err));
    
    const interval = setInterval(async () => {
      try {
        const responseData = await checkNewNotifications();
        if (responseData.isSuccess && responseData.data === true) {
          loadNotifications();
        }
      } catch (error) {
        console.error(error);
      }
    }, 60000); 

    return () => {
      connection.stop();
      clearInterval(interval);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const responseData = await fetchNotifications();
      if (responseData.isSuccess) {
        setNotificationsList(responseData.data);
        setUnreadCount(responseData.data.filter(n => !n.isReaded).length);
      }
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotificationsList(notificationsList.map(n => ({ ...n, isReaded: true })));
      setUnreadCount(0);
    } catch (error) { console.error(error); }
  };

  const handleMarkAsOpened = async (id) => {
    try {
      await markAsOpened(id);
      setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, isReaded: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Mark Opened Error:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotificationsList(prev => prev.filter(n => n.id !== id));
    } catch (error) { console.error(error); }
  };

  const handleTriggerTest = async () => {
    try {
      await triggerTestNotification();
    } catch (error) { console.error(error); }
  };

  const filteredNotifications = notificationsList.filter(n => 
    activeFilter === "All" ? true : n.isReaded === false
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12 font-display relative">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black text-[#1E293B]">Notifications</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleTriggerTest} className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black hover:bg-amber-100 transition-all uppercase tracking-widest">
            <FiPlay className="inline mr-1" /> Test Live
          </button>
          <button onClick={handleMarkAllRead} className="relative p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <FiBell size={24} className={unreadCount > 0 ? "text-[#22C55E]" : "text-gray-400"} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-lg">{unreadCount}</span>}
          </button>
        </div>
      </div>

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

      {showToast && latestNotify && <LiveToast notification={latestNotify} onClose={() => setShowToast(false)} />}
    </div>
  );
}