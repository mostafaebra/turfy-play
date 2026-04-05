import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { fetchNotificationSettings, updateNotificationSettings } from "../../../services/settingsApi";

const NotificationsTab = forwardRef((props, ref) => {
  const [settings, setSettings] = useState({
    receiveNewBookingEmail: false,
    receiveNewBookingSMS: false,
    receiveCancellationAlerts: false,
    receiveLoyaltyProgramUpdates: false,
    receiveNewsletter: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [changedFields, setChangedFields] = useState({});  
   
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const responseData = await fetchNotificationSettings();
        if (responseData.isSuccess) {
          setSettings(responseData.data);
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleToggle = (field) => {
    const newValue = !settings[field];
    setSettings({ ...settings, [field]: newValue });
    setChangedFields({ ...changedFields, [field]: newValue });  
  };

  useImperativeHandle(ref, () => ({
    handleUpdateNotifications: async () => {
      if (Object.keys(changedFields).length === 0) {
        alert("No changes to save.");
        return;
      }

      try {
        const responseData = await updateNotificationSettings(changedFields);
        if (responseData.isSuccess) {
          alert("Notification settings updated successfully!");
          setChangedFields({}); 
        }
      } catch (error) {
        console.error("Update error:", error);
        alert("Failed to update settings.");
      }
    }
  }));

  if (loading) return <div className="h-40 flex items-center justify-center font-bold text-[#22C55E]">Loading Settings...</div>;

  return (
    <div className="flex flex-col gap-8 pb-20 animate-fadeIn font-display">
      {/* 1. Booking Alerts Section */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="mb-6">
          <h3 className="font-black text-xl text-[#1E293B]">Booking Alerts</h3>
          <p className="text-sm text-gray-400 font-medium mt-1">Receive real-time updates for your field bookings.</p>
        </div>
        
        <div className="space-y-4">
          <NotificationToggle 
            label="New Booking (Email)" 
            checked={settings.receiveNewBookingEmail} 
            onToggle={() => handleToggle("receiveNewBookingEmail")} 
          />
          <NotificationToggle 
            label="New Booking (SMS)" 
            checked={settings.receiveNewBookingSMS} 
            onToggle={() => handleToggle("receiveNewBookingSMS")} 
          />
          <NotificationToggle 
            label="Cancellation Alerts" 
            checked={settings.receiveCancellationAlerts} 
            onToggle={() => handleToggle("receiveCancellationAlerts")} 
          />
        </div>
      </section>

      {/* 2. Marketing & Updates Section */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="mb-6">
          <h3 className="font-black text-xl text-[#1E293B]">Marketing & Updates</h3>
          <p className="text-sm text-gray-400 font-medium mt-1">Stay informed about Turfy Play news and loyalty program benefits.</p>
        </div>
        
        <div className="space-y-4">
          <NotificationToggle 
            label="Loyalty Program Updates" 
            checked={settings.receiveLoyaltyProgramUpdates} 
            onToggle={() => handleToggle("receiveLoyaltyProgramUpdates")} 
          />
          <NotificationToggle 
            label="Turfy Play Newsletter" 
            checked={settings.receiveNewsletter} 
            onToggle={() => handleToggle("receiveNewsletter")} 
          />
        </div>
      </section>
    </div>
  );
});

const NotificationToggle = ({ label, checked, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl border border-gray-100">
    <span className="font-bold text-[#1E293B] text-sm">{label}</span>
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${checked ? 'bg-[#22C55E]' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

export default NotificationsTab;