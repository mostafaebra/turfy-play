import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // To get competition data
import { ArrowLeft } from "lucide-react";

// Components
import RegistrationStepper from "../../components/Competition/WizardSteps/RegistrationStepper";
import Step1TeamDetails from "../../components/Competition/WizardSteps/Step1TeamDetails";
import Step2Payment from "../../components/Competition/WizardSteps/Step2Payment";
import Step3Confirmation from "../../components/Competition/WizardSteps/Step3Confirmation";

// API
import { registerTeamInCompetition } from "../../services/api"; // API call

const RegisterCompetitionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get competition data from the previous page (or use default values for testing)
  const competition = location.state?.competition || {
    id: 147,
    name: "Summer Kickoff Cup",
    sport: "5-a-side Football",
    price: 630, // Price from postman
    teamSize: "5-8 players",
    deadline: "July 15, 2026",
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state

  // State
  const [formData, setFormData] = useState({
    // Step 1
    teamName: "",
    captainName: "Ahmed Owner", // Can be fetched from User Context
    teamLogo: null,
    nickname: "", // This will be sent as TeamNickname

    // Step 2
    useWallet: false,
    paymentMethod: "credit_card",
  });

  // Navigation
  const handleNext = () => {
    // Validation for Step 1
    if (currentStep === 1) {
      if (!formData.teamName) {
        alert("Please enter a team name first!");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Final submit handler (passed to Step 2)
  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        competitionId: competition.id,
        price: competition.price,
        teamName: formData.teamName,
        teamNickname: formData.nickname,
        teamCaptain: formData.captainName,
        teamLogo: formData.teamLogo,
        // Ensure the name here matches the one in api.js
        isWalletUsed: formData.useWallet,
        paymentMethod: formData.paymentMethod,
      };

      const response = await registerTeamInCompetition(payload);

      if (response.isSuccess === true) {
        if (response.data && response.data.redirectUrl) {
          // Immediate redirect to Paymob, no need to call setCurrentStep(3) here
          window.location.href = response.data.redirectUrl;
        } else {
          // If no payment is required (like cash or wallet covered the price), show success step
          setCurrentStep(3);
        }
      } else {
        alert("⚠️ " + (response.message || "Registration failed"));
      }
    } catch (error) {
      console.error("Submission Error:", error);
      
      const errorMsg = error.response?.data?.message || "Server Error";
      alert("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* --- Header --- */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentStep > 1) handleBack();
                else navigate(-1);
              }}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[#111827]">
                Register for {competition.name}
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Step {currentStep} of 3
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs border border-green-200">
            AO
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        {/* 1. Competition Summary Card (Dynamic) */}
        {currentStep < 3 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
              Competition Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider">
                  Sport
                </p>
                <p className="font-semibold text-gray-700">
                  {competition.sport}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider">
                  Entry Fee
                </p>
                <p className="font-semibold text-gray-700">
                  {competition.price} EGP / team
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider">
                  Team Size
                </p>
                <p className="font-semibold text-gray-700">
                  {competition.teamSize}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider">
                  Deadline
                </p>
                <p className="font-semibold text-red-500">
                  {competition.deadline}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Stepper Component */}
        <RegistrationStepper currentStep={currentStep} />

        {/* 3. Steps Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {currentStep === 1 && (
            <Step1TeamDetails
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <Step2Payment
              formData={formData}
              competitionPrice={competition.price} 
              updateFormData={updateFormData}
              onBack={handleBack}
              onSubmit={handleFinalSubmit}
              loading={loading} 
            />
          )}

          {currentStep === 3 && <Step3Confirmation formData={formData} />}
        </div>
      </div>
    </div>
  );
};

export default RegisterCompetitionPage;