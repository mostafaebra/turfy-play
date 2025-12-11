import React, { useRef } from 'react';
import { X, Plus } from 'lucide-react';

const PhotoGallery = ({ data, onRemoveUrl, onRemoveFile, onAddFile }) => {
  // Safe access
  const existingImages = data?.imageUrls || [];
  const newImages = data?.newImages || []; // Files waiting to be uploaded
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (onAddFile) {
        onAddFile(e.target.files[0]);
      }
      // Reset input so same file can be selected again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* 1. EXISTING IMAGES (From URL) */}
        {existingImages.map((imgUrl, index) => (
          <div key={`url-${index}`} className="relative aspect-video rounded-lg overflow-hidden group border border-gray-200">
            <img 
              src={imgUrl} 
              alt={`Field ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {e.target.src = "https://via.placeholder.com/300?text=Error"}} 
            />
            {/* Hover X Button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => onRemoveUrl && onRemoveUrl(imgUrl)}
                className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                title="Remove Image"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}

        {/* 2. NEW IMAGES (Local Files) */}
        {newImages.map((file, index) => (
          <div key={`file-${index}`} className="relative aspect-video rounded-lg overflow-hidden group border-2 border-green-500">
            <img 
              src={URL.createObjectURL(file)} 
              alt="New Upload" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                New
            </div>
            {/* Hover X Button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => onRemoveFile && onRemoveFile(index)}
                className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                title="Remove File"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}

        {/* 3. ADD BUTTON */}
        <div 
            onClick={() => fileInputRef.current.click()}
            className="aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 cursor-pointer flex flex-col items-center justify-center transition-all group"
        >
            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center mb-2 text-gray-400 group-hover:text-green-600 transition-colors">
                <Plus size={24} />
            </div>
            <span className="text-xs font-medium text-gray-500 group-hover:text-green-600">Upload Image</span>
            
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
            />
        </div>

      </div>
    </div>
  );
};

export default PhotoGallery;