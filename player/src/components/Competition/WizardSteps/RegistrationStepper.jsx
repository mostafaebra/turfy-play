import React from "react";
import { Check } from "lucide-react";

const RegistrationStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Team Details" },
    { id: 2, label: "Payment" },
    { id: 3, label: "Confirmation" },
  ];

  // Calculate progress bar width based on current step
  const progressWidth =
    currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%";

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 px-4">
      <div className="relative">
        {/* 1. Background Track (Gray Line) */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -translate-y-1/2 rounded-full z-0"></div>

        {/* 2. Progress Bar (Green Line) */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out z-0"
          style={{ width: progressWidth }}
        ></div>

        {/* 3. Steps Indicators (Circles) */}
        <div className="relative z-10 flex justify-between w-full">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 relative bg-gray-50
                    ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white shadow-md scale-110" // Completed
                        : isActive
                          ? "bg-white border-green-500 text-green-600 ring-4 ring-green-100 scale-110" // Active
                          : "bg-gray-50 border-gray-300 text-gray-400" // Pending
                    }
                  `}
                >
                  {isCompleted ? <Check size={20} strokeWidth={3} /> : step.id}
                </div>

                {/* Step Label */}
                <span
                  className={`absolute top-12 text-xs font-semibold whitespace-nowrap transition-colors duration-300
                    ${isActive ? "text-green-700" : isCompleted ? "text-green-600" : "text-gray-400"}
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RegistrationStepper;