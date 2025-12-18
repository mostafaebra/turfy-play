import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Loader2 } from "lucide-react";

const ReportIssue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const mockData = {
    fieldName: "Green Valley Soccer Park - Field B",
    date: "2023-10-26",
    time: "07:00 PM - 08:00 PM",
  };

  // --- States ---
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  // --- UseEffect (Fetching Data) ---
  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");

    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const getBookingData = async () => {
      try {
        setIsLoading(true);

        const idToSend = location.state?.bookingId || 9;

        // console.log(`📡 Requesting Data for ID: ${idToSend}`);

        const response = await fetch(
          `http://turfy.runasp.net/Turfy/GetByIdBookingDetailsEndpoint_Player/Execute?bookingId=${idToSend}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        // console.log("📦 Backend Response:", result);

        if (result.isSuccess && result.data) {
          setBookingData({
            id: idToSend,
            fieldName: result.data.fieldName,
            date: result.data.date,
            time: `${formatTime(result.data.startTime)} - ${formatTime(
              result.data.endTime
            )}`,
          });
        } else {
          // console.warn("⚠️ API returned error:", result.message);
          setBookingData(mockData);
        }
      } catch (error) {
        // console.error("❌ Catch Error:", error);
        setBookingData(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    getBookingData();
  }, []);

  //  Handlers
  const handleCategorySelect = (item) => {
    setCategory(item);
    if (errors.category) setErrors((prev) => ({ ...prev, category: false }));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (errors.description)
      setErrors((prev) => ({ ...prev, description: false }));
  };

  const handleFiles = (files) => {
    const uploadedFiles = Array.from(files);
    if (images.length + uploadedFiles.length > 3) {
      alert("You can only upload a maximum of 3 images.");
      return;
    }
    const validImages = uploadedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const newImages = validImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0)
      handleFiles(e.target.files);
  };

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
      handleFiles(e.dataTransfer.files);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!category) newErrors.category = true;
    if (!description.trim()) newErrors.description = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    console.log("🚀 Submitting Report:", {
      bookingId: bookingData?.id,
      category,
      description,
      images,
    });
    alert("Report Submitted Successfully!");
  };

  // --- Render Loading ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-green-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading Booking Details...</p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 p-2 hover:bg-gray-200 rounded-full transition"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Report an Issue
        </h1>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-6 md:p-8">
        {/* Booking Context */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex justify-between">
            Booking Context
          </h3>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center border-b border-gray-100 p-4">
              <span className="text-blue-500 font-medium w-32 text-sm">
                Field Name
              </span>
              <span className="text-gray-900 font-medium mt-1 md:mt-0">
                {bookingData?.fieldName}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center border-b border-gray-100 p-4">
              <span className="text-blue-500 font-medium w-32 text-sm">
                Date
              </span>
              <span className="text-gray-900 font-medium mt-1 md:mt-0">
                {bookingData?.date}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center p-4">
              <span className="text-blue-500 font-medium w-32 text-sm">
                Time
              </span>
              <span className="text-gray-900 font-medium mt-1 md:mt-0">
                {bookingData?.time}
              </span>
            </div>
          </div>
        </div>

        {/* --- Issue Category --- */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Issue Category <span className="text-red-500">*</span>
            {errors.category && (
              <span className="text-red-500 text-sm font-normal ml-2 animate-pulse">
                Please select a category
              </span>
            )}
          </h3>
          <div
            className={`flex flex-wrap gap-3 p-2 rounded-2xl transition-colors ${
              errors.category ? "bg-red-50 border border-red-200" : ""
            }`}
          >
            {[
              "Field Condition",
              "Staff Behavior",
              "Safety Concern",
              "Booking Issue",
              "Other",
            ].map((item) => (
              <button
                key={item}
                onClick={() => handleCategorySelect(item)}
                className={`
                  px-6 py-3 rounded-xl text-sm font-medium transition-all border
                  ${
                    category === item
                      ? "bg-green-50 border-green-500 text-green-700 shadow-sm"
                      : errors.category
                      ? "bg-white border-red-300 text-red-500 hover:bg-red-50"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* --- Description --- */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Description <span className="text-red-500">*</span>
            {errors.description && (
              <span className="text-red-500 text-sm font-normal ml-2 animate-pulse">
                Description is required
              </span>
            )}
          </h3>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Please describe the incident clearly..."
            className={`
              w-full h-40 p-4 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition resize-none
              ${
                errors.description
                  ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500 placeholder-red-300"
                  : "border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              }
            `}
          ></textarea>
        </div>

        {/* --- Evidence (Upload) --- */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Evidence{" "}
            <span className="text-gray-400 text-sm font-normal">
              (Optional)
            </span>
          </h3>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragging
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:bg-gray-50"
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
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm backdrop-blur-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Actions --- */}
        <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full md:w-auto px-8 py-3 rounded-full border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full md:w-auto px-8 py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-200 transition"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
