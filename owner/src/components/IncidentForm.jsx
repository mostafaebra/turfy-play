import React, { useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import axios from "axios";

export default function IncidentForm({ bookingId }) {
  const [category, setCategory] = useState(1);
  const [severity, setSeverity] = useState(1);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("BookingId", bookingId);
      formData.append("Category", category);
      formData.append("Severity", severity);
      formData.append("Description", description);
      
       
      images.forEach((img) => formData.append("IssueImages", img));

      const response = await axios.post("http://turfy.runasp.net/Turfy/CreateIssueEndpoint/Handle", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.isSuccess) {
        alert("Report submitted successfully!");
        window.location.href = "/owner-bookings";
      } else {
        
        alert(response.data.message || "Failed to submit report");
      }
    } catch (error) {
     
      const serverMsg = error.response?.data?.message || "An error occurred during submission";
      alert(serverMsg);
      console.error("Submit Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="font-black text-xl text-[#1E293B] mb-8 tracking-tight">The Incident Form</h3>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Issue Category *</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-4 px-4 font-bold text-[#1E293B] outline-none focus:ring-2 focus:ring-[#22C55E]/20"
          >
            <option value={1}>Misconduct / Aggressive Behavior</option>
            <option value={2}>Property Damage</option>
            <option value={3}>No Show</option>
          </select>
        </div>

        {/* Severity Radio Buttons */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Severity Level (optional) </label>
          <div className="flex flex-wrap gap-8">
            {[1, 2, 3].map((val) => (
              <label key={val} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="severity" 
                  checked={severity == val} 
                  onChange={() => setSeverity(val)} 
                  className="w-5 h-5 accent-[#22C55E]" 
                />
                <span className="text-sm font-bold text-gray-500 group-hover:text-[#1E293B] transition-colors">
                  {val === 1 ? "Low" : val === 2 ? "Medium" : "High (Ban Request)"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Description Textarea */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Detailed Description *</label>
          <textarea 
            rows="5" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe exactly what happened, including dates, times, and any relevant details..."
            className="w-full bg-[#F9FAFB] border border-gray-200 rounded-2xl py-4 px-4 font-medium outline-none focus:ring-2 focus:ring-[#22C55E]/20 shadow-sm"
          ></textarea>
        </div>

        {/* Image Upload Area */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Attach Evidence (photos/videos)</label>
          <div className="border-2 border-dashed border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-all cursor-pointer relative group">
            <input type="file" multiple onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="bg-gray-50 p-4 rounded-full text-gray-400 group-hover:text-[#22C55E] group-hover:bg-green-50 transition-all">
              <FiUploadCloud size={32} />
            </div>
            <p className="text-sm font-black text-[#1E293B]"><span className="text-[#22C55E]">Click to upload</span> or drag and drop</p>
          </div>
          
          {/* Preview of Selected Files */}
          <div className="flex flex-wrap gap-3 mt-4">
            {images.map((img, i) => (
              <div key={i} className="px-4 py-2 rounded-lg bg-[#F9FAFB] border border-gray-100 text-[10px] font-bold text-gray-500 flex items-center gap-2">
                <span className="truncate max-w-[100px]">{img.name}</span>
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* alert message*/}
        <p className="text-[15px] text-gray-400 font-medium leading-relaxed">
          This report will be reviewed by the Turfy Play Trust & Safety team. False reporting may lead to penalties.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 pt-4">
          <button type="button" onClick={() => window.history.back()} className="px-10 py-3.5 rounded-xl font-black text-gray-500 border border-gray-100 hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-12 py-3.5 rounded-xl font-black text-white bg-[#EF4444] hover:bg-red-600 transition-all shadow-lg shadow-red-100 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}