import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import Pages
import Home from "./pages/home/home.jsx";
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import Filterpage from "./pages/filterpage/filterpage.jsx";
import FieldDetails from './pages/FieldDetails/FieldDetails.jsx';
import BookingPage from './pages/Booking/BookingPage';
import ReportIssue from './pages/ReportIssue/ReportIssue.jsx';

import RegisterCompetitionPage from "./pages/Competition/RegisterCompetitionPage.jsx";
import ConfirmationPage from "./pages/Competition/ConfirmationPage";

// Import Auth & Password Pages
import ForgotPassword from "./pages/PasswordReset/ForgetPassword.jsx";
import VerifyCodePage from "./pages/PasswordReset/VerifyCodePage.jsx";
import SetNewPasswordPage from "./pages/PasswordReset/SetPasswordPage.jsx";
import ResetSuccessPage from "./pages/PasswordReset/ResetSuccessPage.jsx";

function App() {
  return (
    <Routes>
      {/* Main Route */}
      <Route path="/" element={<Filterpage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCodePage />} />
      <Route path="/set-new-password" element={<SetNewPasswordPage />} />
      <Route path="/reset-success" element={<ResetSuccessPage />} />

      {/* Feature Routes */}
      <Route path="/details/:id" element={<FieldDetails />} />     
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/report-issue" element={<ReportIssue />} />

      <Route path="/competition/register" element={<RegisterCompetitionPage />} />
      <Route path="/competition/confirmation" element={<ConfirmationPage />} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;