import React, { useState } from 'react';
import AdminSidebar from '../../components/sidenavbar'; // Check this path!
import CreateCompetitionStep1 from '../../components/CreateCompetitionStep1';
import CreateCompetitionStep2 from '../../components/CreateCompetitionStep2';
import CreateCompetitionStep3 from '../../components/CreateCompetitionStep3';
import CreateCompetitionStep4 from '../../components/CreateCompetitionStep4';
import { Menu, X } from 'lucide-react';

const AdminCreatecmpetion = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Store all data collected across steps
  const [competitionData, setCompetitionData] = useState({});

  // Handler to move forward and merge data
  const handleNextStep = (stepData = {}) => {
    console.log(`Moving from Step ${currentStep} to ${currentStep + 1}`, stepData);
    setCompetitionData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, 4)); // Cap at step 4
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Progress Bar Logic
  const renderProgressBar = () => {
    const steps = [1, 2, 3, 4];
    const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
      <div className="flex justify-between w-full relative px-2 sm:px-0">
        {/* Gray Track */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 sm:h-1 bg-slate-100 -z-10 rounded -translate-y-1/2"></div>
        {/* Green Path */}
        <div 
            className="absolute top-1/2 left-0 h-0.5 sm:h-1 bg-emerald-500 -z-10 rounded -translate-y-1/2 transition-all duration-500 ease-out"
            style={{ width: `${progressWidth}%` }}
        ></div>
        {/* Dots */}
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          return (
            <div
              key={step}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold ring-2 sm:ring-4 ring-white transition-colors duration-300 text-xs sm:text-sm ${
                isCompleted || isActive
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}
            >
              {isCompleted ? '✓' : step}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <AdminSidebar />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 ml-0 lg:ml-72 flex flex-col h-full relative overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 shrink-0 z-10">
            <div className="max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Mobile Menu Button */}
                        <button
                          onClick={() => setSidebarOpen(!sidebarOpen)}
                          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          aria-label="Toggle sidebar"
                        >
                          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Create New Competition</h2>
                            <p className="text-slate-500 text-xs sm:text-sm mt-1 hidden sm:block">Configure your tournament details, schedule, and rewards.</p>
                        </div>
                    </div>
                    <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 whitespace-nowrap">
                        Save Draft
                    </button>
                </div>
                {renderProgressBar()}
            </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-20">
                
                {/* --- STEP 1 RENDER --- */}
                {currentStep === 1 && (
                    <CreateCompetitionStep1 
                        onNext={handleNextStep} 
                    />
                )}

                {/* --- STEP 2 RENDER --- */}
                {currentStep === 2 && (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center opacity-60">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">Event Essentials</h3>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">✓ Completed</span>
                        </div>
                        <CreateCompetitionStep2 
                            competitionData={competitionData}
                            onNext={handleNextStep}
                            onBack={handlePreviousStep}
                        />
                    </>
                )}

                {/* --- STEP 3 RENDER (THIS WAS MISSING!) --- */}
                {currentStep === 3 && (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center opacity-60">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">Event Essentials</h3>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">✓ Completed</span>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center opacity-60">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">Schedule & Location</h3>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">✓ Completed</span>
                        </div>
                        
                        {/* THE STEP 3 COMPONENT */}
                        <CreateCompetitionStep3
                            competitionData={competitionData}
                            onNext={handleNextStep}
                            onBack={handlePreviousStep}
                        />
                    </>
                )}

                {/* --- STEP 4 RENDER (THIS WAS MISSING!) --- */}
                {currentStep === 4 && (
                    <>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center opacity-60">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">Details & Prizes</h3>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">✓ Completed</span>
                        </div>
                        
                        {/* THE STEP 4 COMPONENT */}
                        <CreateCompetitionStep4 
                            competitionData={competitionData}
                            onBack={handlePreviousStep}
                            onSubmit={(finalData) => {
                                console.log("FINAL DATA TO SEND:", finalData);
                                alert("Competition Created! Check console for JSON.");
                            }}
                        />
                    </>
                )}

                {/* Future Steps Placeholders (Visuals only for unreached steps) */}
                {currentStep < 2 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center opacity-60">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">Schedule & Location</h3>
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">Step 2</span>
                    </div>
                )}
                {currentStep < 3 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center opacity-60">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">Details & Prizes</h3>
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">Step 3</span>
                    </div>
                )}
                 {currentStep < 4 && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center opacity-60">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">Preview</h3>
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">Step 4</span>
                    </div>
                )}

            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCreatecmpetion;