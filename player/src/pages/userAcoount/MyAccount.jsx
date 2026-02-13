import React, { useEffect, useState } from "react";
import AccHeader from "../../components/AccHeader"; 
import Sidebar from "../../components/Sidebar";
import ProfilePictureSection from "../../components/ProfilePictureSection";
import PersonalDetailsForm from "../../components/PersonalDetailsForm";
import SecuritySection from "../../components/SecuritySection";
import { getPlayerInfo , updatePlayerProfile } from "../../services/playerService";

export default function MyAccount() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // حالة خاصة عند الضغط على حفظ
  const [error, setError] = useState(null);

  // حالات لتخزين التعديلات الجديدة
  const [newFullName, setNewFullName] = useState("");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    async function loadPlayer() {
      try {
        const data = await getPlayerInfo();
        setPlayer(data);
        setNewFullName(data.fullName); // تعيين القيمة الابتدائية للاسم
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPlayer();
  }, []);

  // دالة الحفظ
  const handleSaveChanges = async () => {
    setUpdating(true);
    try {
      await updatePlayerProfile(newFullName, newImage);
      alert("Profile updated successfully! ✅");
      // اختياري: إعادة جلب البيانات للتأكد من تحديثها
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-gray-500 font-display">Loading account...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-display">
    <AccHeader userImage={player?.profileImageUrl} />
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">
        <Sidebar />
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-10">
          
          <h2 className="text-lg font-bold text-gray-800 mb-6 font-display">Profile Picture</h2>
          <ProfilePictureSection 
            avatarUrl={player?.profileImageUrl} 
            onImageSelect={(file) => setNewImage(file)} // دالة لاستلام الملف المختار
          />

          <hr className="my-10 border-gray-200" />

          <h2 className="text-lg font-bold text-gray-800 mb-6 font-display">Personal Details</h2>
          <PersonalDetailsForm
            fullName={newFullName}
            onChangeFullName={(val) => setNewFullName(val)} // دالة لتحديث الاسم في الـ State
            email={player?.email}
            phone={player?.phoneNumber}
          />

          <hr className="my-10 border-gray-200" />

          <h2 className="text-lg font-bold text-gray-800 mb-6 font-display">Password & Security</h2>
          <SecuritySection />

          <div className="flex justify-end mt-12">
            <button 
              onClick={handleSaveChanges}
              disabled={updating}
              className={`${
                updating ? "bg-gray-300" : "bg-primary hover:bg-primary/90"
              } text-white px-10 py-3 rounded-lg text-sm font-bold shadow-sm transition`}
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}