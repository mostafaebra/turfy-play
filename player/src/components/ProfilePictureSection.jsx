import React, { useState, useRef } from "react";

export default function ProfilePictureSection({ avatarUrl, onImageSelect }) {
   
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      setPreview(URL.createObjectURL(file));
      
      onImageSelect(file);
    }
  };
  const getImageUrl = (url) => {
  // لو الرابط فيه placeholder أو كلمة string أو فاضي
  if (!url || url === "string" || url.includes("placeholder") || url.includes("pravatar")) {
    // استخدمي رابط صورة من الـ assets عندك أو صورة تانية مستقرة
    return "https://ui-avatars.com/api/?name=User&background=random"; 
  }
  return url;
};

  return (
    <div className="flex items-center gap-8 font-display">
      {/* دائرة الصورة الشخصية */}
      <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden border-2 border-primary/20 shadow-md">
        <img
          src={preview || avatarUrl || "http://via.placeholder.com/150"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      { }
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
        >
          Upload New Picture
        </button>
        <p className="text-[10px] text-text-light mt-2 italic">
           
        </p>
      </div>
    </div>
  );
}