import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Home } from "lucide-react";
import API, { submitReportIssue } from "../../services/api";

// Components
import BookingDetailsCard from "../../components/ReportIssue/BookingDetailsCard";
import IssueCategorySelector from "../../components/ReportIssue/IssueCategorySelector";
import EvidenceUploader from "../../components/ReportIssue/EvidenceUploader";

const ReportIssue = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- States ---
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [pageError, setPageError] = useState({ hasError: false, message: "" }); 
  const [submitError, setSubmitError] = useState(""); 

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  // --- Fetch Data ---
  useEffect(() => {
    const getBookingData = async () => {
      try {
        setIsLoading(true);
        const idToSend = location.state?.bookingId || 275; 
        
        const response = await API.get("/GetIssuePageEndpoint/Execute", {
          params: { BookingId: idToSend },
        });

        const result = response.data;
        
        if (result.isSuccess && result.data) {
          setBookingData({
            id: result.data.bookingId || idToSend,
            fieldName: result.data.fieldName,
            date: result.data.date,
            time: result.data.time, 
            accused: result.data.accused,
          });
        } else {
          let errorMessage = "An unknown error occurred.";
          if (result.errorCode === 101) {
             errorMessage = "You have already reported this booking. Our team is reviewing it.";
          } else {
             errorMessage = result.message || "Sorry, we cannot process this booking right now.";
          }

          setPageError({ hasError: true, message: errorMessage });
        }
      } catch (error) {
        console.error("API Error:", error);
        setPageError({ hasError: true, message: "Connection error. Please try again later." });
      } finally {
        setIsLoading(false);
      }
    };

    getBookingData();
  }, [location.state]);

  // --- Handlers ---
  const handleCategorySelect = (item) => {
    setCategory(item);
    if (errors.category) setErrors((prev) => ({ ...prev, category: false }));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (errors.description) setErrors((prev) => ({ ...prev, description: false }));
  };

  const handleFiles = (files) => {
    setSubmitError(""); 
    const uploadedFiles = Array.from(files);
    
    if (images.length + uploadedFiles.length > 3) {
      setSubmitError("You can only upload a maximum of 3 images.");
      return;
    }
    
    
    const validImages = [];
    for (let file of uploadedFiles) {
      if (!file.type.startsWith("image/")) {
        setSubmitError(`"${file.name}" is not a valid image.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) { 
        setSubmitError(`"${file.name}" is too large (Max: 5MB).`);
        continue;
      }
      validImages.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setImages((prev) => [...prev, ...validImages]);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- Submit Report ---
  const handleSubmit = async () => {
    setSubmitError(""); 
    const newErrors = {};
    if (!category) newErrors.category = true;
    if (!description.trim()) newErrors.description = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const categoryMapping = {
      "Field Condition": 1,
      "Staff Behavior": 2,
      "Safety Concern": 3,
      "Booking Issue": 4,
      "Other": 5,
    };
    const categoryId = categoryMapping[category] || 5;

    try {
      setIsSubmitting(true);
      
      const payload = {
        bookingId: bookingData?.id,
        category: categoryId, 
        severity: 2, 
        description: description,
        images: images,
      };

      const response = await submitReportIssue(payload);

      if (response.isSuccess) {
        setShowSuccess(true);
      } else {
        setSubmitError(response.message || "Could not submit report. Please try again.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setSubmitError("An error occurred connecting to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Render Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-green-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading Booking Details...</p>
      </div>
    );
  }

  
  // 2. Render Page Error 
  if (pageError.hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Unavailable</h2>
          <p className="text-gray-600 mb-8 leading-relaxed font-medium">
            {pageError.message}
          </p>
          <div className="space-y-3">
            <button onClick={() => navigate(-1)} className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition">
              Go Back
            </button>
            <button onClick={() => navigate("/")} className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition flex items-center justify-center gap-2">
              <Home size={18} />
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  
  // 3. Render Success State
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed font-medium">
            Thank you for bringing this to our attention. Our team will review your report and get back to you shortly.
          </p>
          <button onClick={() => navigate("/")} className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 shadow-lg shadow-green-200 transition flex items-center justify-center gap-2">
            <Home size={18} />
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  
  // 4. Main Render 
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24 font-sans">
      <div className="max-w-3xl mx-auto mb-8">
        <button onClick={() => navigate(-1)} className="mb-4 p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900">Report an Issue</h1>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-6 md:p-8">
        
        <BookingDetailsCard bookingData={bookingData} />
        
        <IssueCategorySelector 
          selectedCategory={category} 
          onSelect={handleCategorySelect} 
          error={errors.category} 
        />

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Description <span className="text-red-500">*</span>
            {errors.description && (
              <span className="text-red-500 text-sm font-normal ml-2 animate-pulse">Description is required</span>
            )}
          </h3>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Please describe the incident clearly..."
            className={`w-full h-40 p-4 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:outline-none transition resize-none ${
              errors.description ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            }`}
          ></textarea>
        </div>

        <EvidenceUploader 
          images={images} 
          onFilesSelected={handleFiles} 
          onRemoveImage={removeImage} 
        />

        {submitError && (
          <div className="w-full p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-center font-medium border border-red-100 animate-in fade-in duration-300">
            {submitError}
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-center pt-4">
          <button 
            onClick={() => navigate(-1)} 
            disabled={isSubmitting}
            className="w-full md:w-auto px-8 py-3 rounded-full border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={`w-full md:w-auto px-8 py-3 rounded-full text-white font-bold shadow-lg transition flex items-center justify-center gap-2 ${
              isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 shadow-green-200"
            }`}
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : null}
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;