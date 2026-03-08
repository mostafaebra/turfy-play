import React, { useRef, useState } from "react";
import { Upload, Trash2 } from "lucide-react";

const EvidenceUploader = ({ images, onFilesSelected, onRemoveImage }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div className="mb-10">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        Evidence <span className="text-gray-400 text-sm font-normal">(Optional)</span>
      </h3>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging ? "border-green-500 bg-green-50" : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          className="hidden"
          multiple
          accept="image/png, image/jpeg"
        />
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-500">
          <Upload size={24} />
        </div>
        <p className="text-gray-900 font-medium mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-gray-400 text-sm">Max 3 images (JPG, PNG)</p>
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden border border-gray-200 h-24"
            >
              <img
                src={img.preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm backdrop-blur-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceUploader;