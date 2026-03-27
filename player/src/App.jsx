import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import Home from "./pages/home/home.jsx";
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import Filterpage from "./pages/filterpage/filterpage.jsx";
import ForgotPassword from "./pages/PasswordReset/ForgetPassword.jsx";
import VerifyCodePage from "./pages/PasswordReset/VerifyCodePage.jsx";
import SetNewPasswordPage from "./pages/PasswordReset/SetPasswordPage.jsx";
import ResetSuccessPage from "./pages/PasswordReset/ResetSuccessPage.jsx";
import MyAccount from "./pages/userAcoount/MyAccount.jsx";
import BookingDetails from "./pages/BookingDetails/BookingDetails.jsx";
import Competitions from "./pages/Events&Competitions/Competitions.jsx";
import PlayerNotifications from "./pages/PlayerNotifications/PlayerNotifications.jsx";  
import WriteReview from "./pages/Reviewpage/WriteReview.jsx"; 
import TicketDetails from "./pages/MyCompetitionDetails/TicketDetails.jsx"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The "index" route - what you see at http://localhost:5173/ */}
        <Route path="/" element={<Filterpage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route path="/set-new-password" element={<SetNewPasswordPage />} />
        <Route path="/reset-success" element={<ResetSuccessPage />} />
        <Route path="/my-account" element={<MyAccount />} />
       <Route path="/booking-details/:id" element={<BookingDetails />} />  
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/notifications" element={<PlayerNotifications />} /> 
      <Route path="/write-review/:bookingId" element={<WriteReview />} />
      <Route path="/ticket-details/:id" element={<TicketDetails />} />  
      

        {/* Catch-all: Redirect unknown URLs back to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
