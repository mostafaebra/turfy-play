// (git commit --amend --no-edit) -----> update into latest commit without edit
import React, { useState } from "react";
import { FiArrowRight, FiArrowLeft ,FiCheckCircle } from "react-icons/fi";

import Navbar from "../../components/Navbar";
import Stepper from "../../components/Stepper";
import Step1Info from "../../components/Step1Info";
import Step2Media from "../../components/Step2Media";
import Step3Details from "../../components/Step3Details";
import Step4Rules from "../../components/Step4Rules";

const AddNewField = () => {

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});


  // which step is active
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };



  
  // handle Errors
  const validateStep = () => {
    let newErrors = {}; 
    let isValid = true; 


    //  Validation for Step 1 
    
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

    //  Validation for Step 2 
    if (currentStep === 2) {
      if (formData.images.length === 0) {
        newErrors.images = "At least one image is required";
        isValid = false;
      }
      if (!formData.contract) {
        newErrors.contract = "Contract file is required";
        isValid = false;
      }
    }

    //  Validation for Step 4 
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

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

    if (currentStep === 4) {
      //alert("Done! Check Console.");
      return;
    }

    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  // main data and store everything
  const [formData, setFormData] = useState({
    fieldName: "",
    sport: "",
    address: "",
    mapLink: "",
    images: [],
    contract: null,
    surfaceType: "Natural Grass",
    fieldSize: "",
    amenities: [],
    pricePerHour: "",
    open24: false,
    openTime: "",
    closeTime: "",
    cancelPolicy: "",
    bookingWindow: "",
  });

  // function handles writing in any input field.
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // remove errors when start a typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null 
      }));
    }
  }

  //handle errors that not consider input
  const handleManualChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Text that changes for each step.
  const stepDescriptions = [
    "Follow the steps below to get your field listed on our platform.",
    "Step 2: Add photos and verify your ownership to attract players.",
    "Step 3: Provide details about your field's specs and amenities.",
    "Step 4: Set your field's pricing and schedule rules.",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/*  Navbar fixed at the top when scrolling */}
      <div className="sticky top-0 z-50 bg-light-gray">
        <Navbar />
        <Stepper currentStep={currentStep} />
      </div>

      {/* --- Header & Title --- */}
      <>
        <div className="text-center mt-4 mb-6 md:mt-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-navy mb-6">
            Add New Field
          </h1>
          {/* Show description based on current step number */}
          <p className="text-sm md:text-xl text-text-light mb-3">
            {stepDescriptions[currentStep - 1]}
          </p>
        </div>
      </>

      {/* --- Form Container --- */}
      <div className="rounded-xl max-w-3xl mx-auto bg-light-gray p-6 md:p-10 border border-border-color mb-5">
        {/* Show this only if we are in Step 1 */}
        {(currentStep === 1 && (
          <Step1Info
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            errors={errors}
            handleManualChange={handleManualChange}
          />
        )) ||
          (currentStep === 2 && (
            <Step2Media
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
          )) ||
          (currentStep === 3 && (
            <Step3Details
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
              errors={errors}
            />
          )) ||
          (currentStep === 4 && (
            <Step4Rules
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
              errors={errors}
            />
          ))}

        {/* --- Buttons --- */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-color">
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                      ${
                        currentStep === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" // Style when disabled
                          : "bg-white border-2 border-border-color text-text-dark hover:border-primary hover:text-primary" // Style when active
                      }`}
          >
            <FiArrowLeft /> Back
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className={`
              flex items-center justify-center gap-2 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all duration-200
              ${currentStep === 4 
                  ? "bg-emerald-600 hover:bg-emerald-700 flex-1" 
                  : "bg-primary hover:bg-emerald-600"            
              }
            `}
          >
            {currentStep === 4 ? "Submit for Review" : "Next Step"}
            {currentStep === 4 ? <FiCheckCircle size={20} /> : <FiArrowRight />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewField;
