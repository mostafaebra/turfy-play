import React, { useRef, useState } from "react";
import { UploadCloud, User, Shield, Type, X } from "lucide-react";

const Step1TeamDetails = ({ formData, updateFormData, onNext }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  // دالة التعامل مع اختيار الصورة
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        alert("File size is too large! Max 5MB.");
        return;
      }
      // حفظ الملف في الـ State
      updateFormData("teamLogo", file);
      // عمل Preview للصورة
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // دالة زرار Next
  const handleSubmit = () => {
    if (!formData.teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }
    setError("");
    onNext(); // نروح للخطوة اللي بعدها
  };

  // دالة حذف الصورة المختارة
  const removeImage = (e) => {
    e.stopPropagation();
    updateFormData("teamLogo", null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Step 1: Team Details</h2>
      </div>

      <div className="space-y-6">
        
        {/* --- 1. Team Name --- */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            Team Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="e.g. The Avengers"
              className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all
                ${error ? "border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"}
              `}
              value={formData.teamName}
              onChange={(e) => {
                updateFormData("teamName", e.target.value);
                if (error) setError("");
              }}
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* --- 2. Team Captain (Read Only) --- */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Team Captain</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              value={formData.captainName}
              disabled
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium"
            />
          </div>
          <p className="text-[10px] text-gray-400">Logged in user is automatically assigned as captain.</p>
        </div>

        {/* --- 3. Logo Upload (Custom Design) --- */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Team Logo (Optional)</label>
          
          <div 
            onClick={() => fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group
              ${previewUrl ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-gray-50"}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />

            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Logo Preview" className="w-24 h-24 object-cover rounded-full shadow-md border-2 border-white" />
                <button 
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all shadow-sm"
                >
                  <X size={14} />
                </button>
                <p className="text-xs text-green-700 font-semibold mt-3 text-center">Logo Selected</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-green-100 transition-colors">
                  <UploadCloud className="text-gray-400 group-hover:text-green-600" size={24} />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  <span className="text-green-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG (max. 5MB)</p>
              </>
            )}
          </div>
        </div>

        {/* --- 4. Nickname (Optional) --- */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Team Nickname / Motto (Optional)</label>
          <div className="relative">
            <Type className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="e.g. We play to win!"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
              value={formData.nickname}
              onChange={(e) => updateFormData("nickname", e.target.value)}
            />
          </div>
        </div>

        {/* --- Action Button --- */}
        <div className="pt-4">
          <button 
            onClick={handleSubmit}
            className="w-full bg-[#111827] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Next: Payment Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default Step1TeamDetails;