// (git commit --amend --no-edit) -----> update into latest commit without edit 
import React, { useState } from "react";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";

import Navbar from "../../components/Navbar";
import Stepper from "../../components/Stepper";
import Step1Info from "../../components/Step1Info";
import Step2Media from "../../components/Step2Media";

const AddNewField = () => {
  
  // main data and store everything
  const [formData, setFormData] = useState({
    fieldName: "",
    sport: "football",
    address: "",
    mapLink: "",
    images : [],
    contract: null,
  });


  // function handles writing in any input field.
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }


  // which step is active
  const [currentStep, setCurrentStep] = useState(2);



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
        { currentStep === 1 && (
            <Step1Info 
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData} 
            />
          ) ||
          currentStep === 2 && (
            <Step2Media 
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData} 
            />
          )

        }

        {/* --- Buttons --- */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-color">
          
          {/* Back Button */}
          <button
            // onClick={handleBack}
            // disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                      ${currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" // Style when disabled
                : "bg-white border-2 border-border-color text-text-dark hover:border-primary hover:text-primary" // Style when active
              }`}
          >
          <FiArrowLeft /> Back
          </button>

          {/* Next Button */}
          <button
          // onClick={handleNext}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-emerald-600 hover:scale-[1.02] transition-all duration-200"
          >
            Next Step <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewField;