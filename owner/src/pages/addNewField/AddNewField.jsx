import React, { useState } from "react";
//import axios from 'axios';
import { FiArrowRight, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

import {
  SportTypeMapping,
  SurfaceTypeMapping,
  FieldFormatMapping,
  AmenitiesMapping,
  CancellationMapping,
  BookingWindowMapping,
} from "../../utils/mappings";

import Navbar from "../../components/Navbar";
import Stepper from "../../components/Stepper";
import Step1Info from "../../components/Step1Info";
import Step2Media from "../../components/Step2Media";
import Step3Details from "../../components/Step3Details";
import Step4Rules from "../../components/Step4Rules";

const AddNewField = () => {
  // ==================== 1. State Management ====================

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Main Data Store
  const [formData, setFormData] = useState({
    fieldName: "",
    sport: "",
    address: "",
    mapLink: "",
    coords: { x: null, y: null },
    images: [],
    contract: [],
    surfaceType: "",
    fieldSize: "",
    fieldFormat: "",
    amenities: [],
    pricePerHour: "",
    open24: false,
    openTime: "",
    closeTime: "",
    cancelPolicy: "",
    bookingWindow: "",
  });

  // ==================== 2. Helper Functions ====================

  // Handle standard text inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Remove error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  // Handle custom inputs (divs, dropdowns)
  const handleManualChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // ==================== 3. Validation Logic ====================

  const validateStep = () => {
    let newErrors = {};
    let isValid = true;

    // Step 1 Validation
    if (currentStep === 1) {
      if (!formData.fieldName) {
        newErrors.fieldName = "Field Name is required";
        isValid = false;
      }
      if (!formData.sport) {
        newErrors.sport = "Please select a sport";
        isValid = false;
      }
      if (!formData.address) {
        newErrors.address = "Address is required";
        isValid = false;
      }
      if (!formData.mapLink) {
        newErrors.mapLink = "Map link is required";
        isValid = false;
      }
    }

    // Step 2 Validation
    if (currentStep === 2) {
      if (formData.images.length === 0) {
        newErrors.images = "At least one image is required";
        isValid = false;
      }
      if (formData.contract.length === 0) {
        newErrors.contract = "At least one contract image is required";
        isValid = false;
      }
    }

    // Step 3 Validation
    if (currentStep === 3) {
      if (!formData.surfaceType) {
        newErrors.surfaceType = "Please select surface type";
        isValid = false;
      }
      if (!formData.fieldFormat) {
        newErrors.fieldFormat = "Please select field format";
        isValid = false;
      }
    }

    // Step 4 Validation
    if (currentStep === 4) {
      if (!formData.pricePerHour) {
        newErrors.pricePerHour = "Price is required";
        isValid = false;
      }
      if (!formData.open24) {
        if (!formData.openTime) {
          newErrors.openTime = "Start time is required";
          isValid = false;
        }
        if (!formData.closeTime) {
          newErrors.closeTime = "End time is required";
          isValid = false;
        }
      }
      if (!formData.cancelPolicy) {
        newErrors.cancelPolicy = "Please select a policy";
        isValid = false;
      }
      if (!formData.bookingWindow) {
        newErrors.bookingWindow = "Please select booking window";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // ==================== 4. Navigation Handlers ====================

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    // create container
    const payload = new FormData();

    // for string input
    payload.append("FieldViewModel.FieldName", formData.fieldName);
    payload.append("FieldViewModel.Address", formData.address);
    payload.append("FieldViewModel.LocationUrl", formData.mapLink);
    payload.append("FieldViewModel.FieldSize", formData.fieldSize || "");
    payload.append(
      "FieldViewModel.FieldDescription",
      `Format: ${formData.fieldFormat}`
    );
    payload.append("FieldViewModel.OpeningTime", formData.openTime || "00:00");
    payload.append(
      "FieldViewModel.OpeningUntil",
      formData.closeTime || "00:00"
    );

    // for number input
    payload.append(
      "FieldViewModel.HourlyPricing",
      Number(formData.pricePerHour)
    );
    payload.append("FieldViewModel.Latitude", formData.coords.y || 0);
    payload.append("FieldViewModel.Longitude", formData.coords.x || 0);

    // for boolean input
    payload.append("FieldViewModel.IsFullTime", formData.open24);

    // Mapping
    payload.append(
      "FieldViewModel.SportType",
      SportTypeMapping[formData.sport] ?? 0
    );
    payload.append(
      "FieldViewModel.SurfaceType",
      SurfaceTypeMapping[formData.surfaceType] ?? 0
    );
    payload.append(
      "FieldViewModel.FieldFormat",
      FieldFormatMapping[formData.fieldFormat] ?? 0
    );
    payload.append(
      "FieldViewModel.BookingPolicy",
      BookingWindowMapping[formData.bookingWindow] ?? 0
    );
    payload.append(
      "FieldViewModel.CancellationPolicy",
      CancellationMapping[formData.cancelPolicy] ?? 0
    );

    // Amenities Array
    formData.amenities.forEach((item) => {
      const amenityId = AmenitiesMapping[item];
      if (amenityId) {
        payload.append("FieldViewModel.FieldFacilities", amenityId);
      }
    });

    // Files

    // cover photo
    if (formData.images.length > 0) {
      payload.append("FieldViewModel.FieldCardImage", formData.images[0].file);
    }

    // other images
    for (let i = 1; i < formData.images.length; i++) {
      payload.append("FieldImages", formData.images[i].file);
    }

    // ContractImages
    formData.contract.forEach((file) => {
      payload.append("ContractImages", file);
    });

    // ============ print result in console ============
    console.log("Payload Content");
    for (let pair of payload.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    setTimeout(() => {
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    }, 1000);

    /*
    try {
      const response = await axios.post(
        "RABET_EL_BACKEND_HENA"
        payload, // 👈 دي الشنطة اللي فيها البيانات والصور
        {
         headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );

      console.log(response.data);
        
      setIsSubmitted(true); 
      window.scrollTo(0, 0);

    } catch (error) {
        console.error("Error X", error);

        if (error.response) {
            console.log("error data:", error.response.data);
            alert(`: ${JSON.stringify(error.response.data)}`); 
        } else {
            alert("error in server");
        }
    }*/
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep === 4) {
      handleSubmit();
      return;
    }

    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  // ==================== 5. UI Render ====================

  const stepDescriptions = [
    "Follow the steps below to get your field listed on our platform.",
    "Step 2: Add photos and verify your ownership to attract players.",
    "Step 3: Provide details about your field's specs and amenities.",
    "Step 4: Set your field's pricing and schedule rules.",
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-light-gray">
        <Navbar />
        <Stepper currentStep={currentStep} />
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {/* Page Header */}
        {!isSubmitted && (
          <div className="text-center mt-8 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-dark-navy mb-3">
              Add New Field
            </h1>
            <p className="text-text-light text-lg transition-all duration-300">
              {stepDescriptions[currentStep - 1]}
            </p>
          </div>
        )}

        {/* --- Main Content Card --- */}
        <div className="rounded-xl max-w-3xl mx-auto bg-white p-6 md:p-10 border border-border-color mb-5 shadow-sm">
          {/* case 1: Submission Successful! */}
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <FiCheckCircle className="text-5xl text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-dark-navy mb-2">
                Submission Successful!
              </h2>
              <p className="text-text-light text-lg mb-8 max-w-md">
                Your field has been submitted successfully. Wait for admin
                approval.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-emerald-600 transition shadow-lg"
              >
                Add Another Field
              </button>
            </div>
          ) : (
            //
            <>
              <div className="mb-8">
                {currentStep === 1 && (
                  <Step1Info
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                    handleManualChange={handleManualChange}
                    errors={errors}
                  />
                )}
                {currentStep === 2 && (
                  <Step2Media
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Details
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                    errors={errors}
                  />
                )}
                {currentStep === 4 && (
                  <Step4Rules
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                  />
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-color">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                                ${
                                  currentStep === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white border-2 border-border-color text-text-dark hover:border-primary hover:text-primary"
                                }`}
                >
                  <FiArrowLeft /> Back
                </button>

                <button
                  onClick={handleNext}
                  className={`flex items-center justify-center gap-2 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-200
                                ${
                                  currentStep === 4
                                    ? "bg-emerald-600 hover:bg-emerald-700 flex-1"
                                    : "bg-primary hover:bg-emerald-600"
                                }`}
                >
                  {currentStep === 4 ? "Submit for Review" : "Next Step"}
                  {currentStep === 4 ? (
                    <FiCheckCircle size={20} />
                  ) : (
                    <FiArrowRight />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewField;
