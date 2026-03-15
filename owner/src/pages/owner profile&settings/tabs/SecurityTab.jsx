import React, { useState, useImperativeHandle, forwardRef } from "react";
import axios from "axios";

const SecurityTab = forwardRef((props, ref) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  
   
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  useImperativeHandle(ref, () => ({
    handleUpdatePassword: async () => {
      if (!oldPassword || !newPassword || !confirmPassword) {
        alert("Please fill all password fields");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("New password and confirmation do not match");
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://turfytesting.runasp.net/Turfy/ChangePasswordEndpoint/ChangePassword",
          {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.isSuccess) {
          alert("Password changed successfully!");
         
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          alert("Error: " + response.data.message);
        }
      } catch (error) {
        console.error("Change password error:", error);
        alert(error.response?.data?.message || "Failed to change password");
      } finally {
        setLoading(false);
      }
    }
  }));

  return (
    <div className="flex flex-col gap-8 pb-20 animate-fadeIn font-display">
      
      {/* 1. Change Password Section */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="mb-6">
          <h3 className="font-black text-xl text-[#1E293B]">Change Password</h3>
          <p className="text-sm text-gray-400 font-medium mt-1">Update your account password for enhanced security.</p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">Current Password</label>
            <input 
              type="password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all" 
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all" 
              />
            </div>
            {/* Password Strength Bar */}
            <div className="flex items-center gap-4">
               <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${newPassword.length > 8 ? 'w-full bg-green-500' : 'w-1/2 bg-yellow-500'}`}></div>
               </div>
               <span className={`text-xs font-bold ${newPassword.length > 8 ? 'text-green-600' : 'text-yellow-600'}`}>
                {newPassword.length > 8 ? 'Strong' : 'Medium'}
               </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all" 
            />
          </div>
        </div>
      </section>

      {/* 2. Two-Factor Authentication (UI Only) */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="mb-8">
          <h3 className="font-black text-xl text-[#1E293B]">Two-Factor Authentication (2FA)</h3>
          <p className="text-sm text-gray-400 font-medium mt-1">Add an extra layer of security to your account.</p>
        </div>

        <div className="flex items-center justify-between p-6 bg-[#F9FAFB] rounded-2xl border border-gray-100">
          <div className="space-y-1">
            <h4 className="font-black text-[#1E293B]">Enable 2FA via SMS</h4>
            <p className="text-xs text-gray-400 font-medium">A verification code will be sent to your registered mobile number upon login.</p>
          </div>
          <div className="flex items-center gap-4">
             <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-gray-100 text-gray-400 ${!is2FAEnabled ? 'opacity-100' : 'opacity-0'}`}>Disabled</span>
             <button
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${is2FAEnabled ? 'bg-[#22C55E]' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${is2FAEnabled ? 'left-7' : 'left-1'}`} />
              </button>
          </div>
        </div>
      </section>
    </div>
  );
});

export default SecurityTab;