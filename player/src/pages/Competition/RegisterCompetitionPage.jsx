import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

// 👇 تم تحديث المسار للمكان الجديد جوه WizardSteps
import RegistrationStepper from "../../components/Competition/WizardSteps/RegistrationStepper";
import Step1TeamDetails from "../../components/Competition/WizardSteps/Step1TeamDetails";
import Step2Payment from "../../components/Competition/WizardSteps/Step2Payment";
import Step3Confirmation from "../../components/Competition/WizardSteps/Step3Confirmation";

const RegisterCompetitionPage = () => {
  // 1. حالة الخطوات (1 = Team, 2 = Payment, 3 = Confirmation)
  const [currentStep, setCurrentStep] = useState(1);

  // 2. الداتا المجمعة (State واحد شايل الليلة كلها)
  const [formData, setFormData] = useState({
    // Step 1: Team Details
    teamName: "",
    captainName: "Ahmed Owner", // ده المفروض يجي من الـ User Context مستقبلاً
    teamLogo: null,
    nickname: "",

    // Step 2: Payment
    useWallet: false,
    paymentMethod: "credit_card", // or 'fawry'
  });

  // 3. دوال التنقل (Next & Back)
  const handleNext = () => {
    // ممكن هنا نعمل Validation بسيط قبل ما ننقل
    if (currentStep === 1 && !formData.teamName) {
      alert("Please enter a team name first!");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // 4. دالة تحديث البيانات (هنباصيها للأبناء)
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* --- Header --- */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* زرار الرجوع */}
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[#111827]">
                Register for Summer Kickoff Cup
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Step {currentStep} of 3
              </p>
            </div>
          </div>

          {/* User Avatar (Optional) */}
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs border border-green-200">
            AO
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        {/* 1. Competition Summary Card (الجزء الثابت) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
            Competition Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider">
                Sport
              </p>
              <p className="font-semibold text-gray-700">5-a-side Football</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider">
                Entry Fee
              </p>
              <p className="font-semibold text-gray-700">1000 EGP / team</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider">
                Team Size
              </p>
              <p className="font-semibold text-gray-700">5-8 players</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider">
                Deadline
              </p>
              <p className="font-semibold text-red-500">July 15, 2026</p>
            </div>
          </div>
        </div>

        {/* 2. Stepper Component */}
        <RegistrationStepper currentStep={currentStep} />

        {/* 3. Steps Content (Dynamic) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* --- Step 1: Team Details --- */}
          {currentStep === 1 && (
            <Step1TeamDetails
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          )}

          {/* --- Step 2: Payment --- */}
          {currentStep === 2 && (
            <Step2Payment
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* --- Step 3: Confirmation --- */}
          {currentStep === 3 && <Step3Confirmation formData={formData} />}
        </div>
      </div>
    </div>
  );
};

export default RegisterCompetitionPage;
