import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { FiEdit2, FiCheckCircle } from "react-icons/fi";
import axios from "axios";

const ProfileTab = forwardRef((props, ref) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [commercialNo, setCommercialNo] = useState("");
  const [taxId, setTaxId] = useState("");
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://turfytesting.runasp.net/Turfy/GetOwnerInfoEndPoint/GetInfo", {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.isSuccess) {
          const d = response.data.data;
          setProfileData(d);
          setFullName(d.fullName || "");
          setBusinessName(d.businessName || "");
          setCommercialNo(d.commercialNo || "");
          setTaxId(d.taxId || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileInfo();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useImperativeHandle(ref, () => ({
    handleUpdateProfile: async () => {
      if (isUpdating) return;
      setIsUpdating(true);
      
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        
         
        formData.append("FullName", fullName);
        formData.append("BusinessName", businessName);
        formData.append("CommercialNo", commercialNo);
        formData.append("TaxId", taxId);
        
        if (selectedImage) {
          formData.append("Image", selectedImage);
        }

        const response = await axios.patch(
          "http://turfytesting.runasp.net/Turfy/UpdateOwnerInfoEndpoint/UpdateProfile",
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        if (response.data.isSuccess) {
          alert("Profile updated successfully!");
          if (response.data.data) setProfileData(response.data.data);
        } else {
          alert("Update failed: " + response.data.message);
        }
      } catch (error) {
        console.error("Update error:", error);
        alert("Something went wrong during update.");
      } finally {
        setIsUpdating(false);
      }
    }
  }));

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="flex flex-col gap-8 pb-20 animate-fadeIn font-display">
      
      {/* 1. Profile Photo Section */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-black text-xl text-[#1E293B] mb-6">Profile Photo</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-gray-50 overflow-hidden bg-[#F3F4F6] flex items-center justify-center">
               <img 
                src={imagePreview || profileData?.image || "https://ui-avatars.com/api/?name=Owner&background=1e293b&color=fff"} 
                alt="Profile" 
                className="w-full h-full object-cover" 
               />
            </div>
            <input type="file" id="imageUpload" className="hidden" accept="image/*" onChange={handleImageChange} />
            <label htmlFor="imageUpload" className="absolute bottom-0 right-0 bg-[#1E293B] text-white p-2 rounded-full border-2 border-white hover:bg-gray-800 transition-all cursor-pointer">
              <FiEdit2 size={14} />
            </label>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-black text-lg text-[#1E293B]">Business Logo</h4>
            <p className="text-sm text-gray-400 font-medium">This will be visible on your field profile.</p>
          </div>
        </div>
      </section>

      {/* 2. Personal Information */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-black text-xl text-[#1E293B] mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold text-[#1E293B] outline-none focus:border-[#22C55E] transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">Phone Number</label>
            <div className="relative">
              <input type="text" readOnly value={profileData?.phoneNumber || ""} className="w-full bg-[#F3F4F6] border border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-400 outline-none pr-24 cursor-not-allowed" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#22C55E] font-black text-[10px] tracking-wider"><FiCheckCircle size={14} /> VERIFIED</div>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-500">Email Address</label>
            <input type="email" value={profileData?.email || ""} disabled className="w-full bg-[#F3F4F6] border border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-400 cursor-not-allowed" />
          </div>
        </div>
      </section>

      {/* 3. Business Information  */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-black text-xl text-[#1E293B] mb-6">Business Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500">Business Name</label>
            <input 
              type="text" 
              value={businessName} 
              onChange={(e) => setBusinessName(e.target.value)} 
              className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold text-[#1E293B] outline-none focus:border-[#22C55E]" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">Commercial Registration No.</label>
              <input 
                type="text" 
                value={commercialNo} 
                onChange={(e) => setCommercialNo(e.target.value)} 
                className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold text-[#1E293B] outline-none focus:border-[#22C55E]" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">Tax ID</label>
              <input 
                type="text" 
                value={taxId} 
                onChange={(e) => setTaxId(e.target.value)} 
                className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 font-bold text-[#1E293B] outline-none focus:border-[#22C55E]" 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default ProfileTab;