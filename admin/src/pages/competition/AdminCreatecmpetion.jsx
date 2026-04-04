import React, { useState } from 'react';
import AdminSidebar from '../../layouts/Sidebar'; 
import CreateCompetitionStep1 from '../../components/CreateCompetitionStep1';
import CreateCompetitionStep2 from '../../components/CreateCompetitionStep2';
import CreateCompetitionStep3 from '../../components/CreateCompetitionStep3';
import CreateCompetitionStep4 from '../../components/CreateCompetitionStep4';
import { Menu, X } from 'lucide-react';

const AdminCreatecmpetion = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [competitionData, setCompetitionData] = useState({});

  const handleNextStep = (stepData = {}) => {
    setCompetitionData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const renderProgressBar = () => {
    const steps = [1, 2, 3, 4];
    const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
      <div className="flex justify-between w-full relative px-2 sm:px-0 max-w-9xl"> 
        <div className="absolute top-1/2 left-0 w-full h-0.5 sm:h-1 bg-slate-100 -z-10 rounded -translate-y-1/2"></div>
        <div 
            className="absolute top-1/2 left-0 h-0.5 sm:h-1 bg-emerald-500 -z-10 rounded -translate-y-1/2 transition-all duration-500 ease-out"
            style={{ width: `${progressWidth}%` }}
        ></div>
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          return (
            <div
              key={step}
              className={`w-8 h-6 sm:w-16 sm:h-10 rounded-full flex items-center justify-center font-bold ring-4 ring-white transition-colors duration-300 text-xs sm:text-sm ${
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
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 lg:ml-26 flex flex-col h-full relative w-full transition-all duration-300">
        
        {/* Header - REMOVED mx-auto, Increased width */}
        <header className="bg-white border-b border-slate-200 px-6 lg:px-8 py-5 shrink-0 z-10 sticky top-0">
            <div className="w-full max-w-9xl"> {/* Changed from max-w-5xl mx-auto to max-w-7xl (left aligned) */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                          onClick={() => setSidebarOpen(true)}
                          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Menu size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 truncate">Create Competition</h2>
                            <p className="text-slate-500 text-sm mt-1 hidden sm:block">Configure tournament details.</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 whitespace-nowrap">
                        Save Draft
                    </button>
                </div>
                {renderProgressBar()}
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth w-full">
            <div className="w-full max-w-9xl space-y-6 pb-20"> 
                {currentStep === 1 && <CreateCompetitionStep1 onNext={handleNextStep} />}
                
                {currentStep === 2 && (
                    <CreateCompetitionStep2 
                        competitionData={competitionData}
                        onNext={handleNextStep}
                        onBack={handlePreviousStep}
                    />
                )}

                {currentStep === 3 && (
                    <CreateCompetitionStep3
                        competitionData={competitionData}
                        onNext={handleNextStep}
                        onBack={handlePreviousStep}
                    />
                )}

                {currentStep === 4 && (
                    <CreateCompetitionStep4 
                        competitionData={competitionData}
                        onBack={handlePreviousStep}
                        onSubmit={(finalData) => alert("Competition Created!")}
                    />
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCreatecmpetion;