import React from "react";
import { FiChevronRight } from "react-icons/fi";

const Stepper = ({ currentStep }) => {
  const steps = ["Info", "Media", "Details", "Rules"];

  return (
    <div
      className="flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 h-12 md:h-14
            gap-2 md:gap-3 bg-slate-900 border-t border-white/10"
    >
      {steps.map((stepName, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;

        return (
          <div key={index} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex justify-center items-center font-medium text-sm
                                ${
                                  isActive
                                    ? "bg-emerald-500 text-white"
                                    : "bg-slate-700 text-gray-300"
                                }
                            `}
              >
                {stepNumber}
              </div>

              <span
                className={`hidden md:block font-medium 
                                ${
                                  isActive
                                    ? "text-emerald-500"
                                    : "text-gray-400"
                                }
                            `}
              >
                {stepName}
              </span>
            </div>

            {index < steps.length - 1 && (
              <FiChevronRight
                className={`${
                  stepNumber < currentStep
                    ? "text-emerald-500"
                    : "text-gray-400"
                } `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
  /*
      return(
          <div className="flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 h-12 md:h-14
              gap-2 md:gap-3 bg-slate-900 border-t border-white/10">
                <div className="flex items-center h-12 gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-500 text-white rounded-full flex justify-center items-center font-medium text-sm">
                        1
                    </div>
                    <span className="hidden md:block text-emerald-500">Info</span>
                </div>

                <FiChevronRight className="text-gray-600 mx-2 shrink-0" />

                <div className="flex items-center h-12 gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-700 text-white rounded-full flex justify-center items-center font-medium text-sm">
                        2
                    </div>
                    <span className="hidden md:block text-gray-300">Media</span>
                </div>

                <FiChevronRight className="text-gray-600 mx-2 shrink-0" />

                <div className="flex items-center h-12 gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-700 text-white rounded-full flex justify-center items-center font-medium text-sm">
                        3
                    </div>
                    <span className="hidden md:block text-gray-300">Details</span>
                </div>

                <FiChevronRight className="text-gray-600 mx-2 shrink-0" />

                <div className="flex items-center h-12 gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-700 text-white rounded-full flex justify-center items-center font-medium text-sm">
                        4
                    </div>
                    <span className="hidden md:block text-gray-300">Rules</span>
                </div>
            </div>
            );
            */
};
export default Stepper;
