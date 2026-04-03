import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Pages
import Filterpage from './pages/filterpage/filterpage.jsx';
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import FieldDetails from './pages/FieldDetails/FieldDetails.jsx';

// --- Feature Pages (Competition & Report) ---
import ReportIssue from './pages/ReportIssue/ReportIssue.jsx';
import RegisterCompetitionPage from "./pages/Competition/RegisterCompetitionPage.jsx";
import ConfirmationPage from "./pages/Competition/ConfirmationPage.jsx";
import MyCompetitionsPage from "./pages/MyCompetitions/MyCompetitionsPage.jsx"; // <-- Import added

// --- Auth & Password Pages ---
import ForgotPassword from "./pages/PasswordReset/ForgetPassword.jsx";
import VerifyCodePage from "./pages/PasswordReset/VerifyCodePage.jsx";
import SetPasswordPage from "./pages/PasswordReset/SetPasswordPage.jsx";

// --- Auth & Password Pages ---
import ForgotPassword from "./pages/PasswordReset/ForgetPassword.jsx";
import VerifyCodePage from "./pages/PasswordReset/VerifyCodePage.jsx"; 
import SetNewPasswordPage from "./pages/PasswordReset/SetNewPasswordPage.jsx";
import ResetSuccessPage from "./pages/PasswordReset/ResetSuccessPage.jsx";

// --- Account & Bookings Pages ---
import WalletPage from "./pages/account/WalletPage.jsx"; 
import MyBookingsPage from "./pages/Bookings/MyBookingsPage.jsx"; 
import BookingPage from "./pages/Booking/BookingPage.jsx"; 

// --- Payment Pages ---
import PaymentPage from "./pages/Payment/PaymentPage.jsx";
import PaymentSuccess from "./pages/Payment/PaymentSuccess.jsx";
import PaymentFailed from "./pages/Payment/PaymentFailed.jsx";

const RootLayout = () => (
  <div className="antialiased text-slate-900">
    <Outlet />
  </div>
);


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Filterpage /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/details/:id", element: <FieldDetails /> },
      
      { path: "/booking/:id", element: <BookingPage /> }, 
      
      { path: "/bookings", element: <MyBookingsPage /> }, 
      { path: "/competitions", element: <MyCompetitionsPage /> }, // <-- Route added
      { path: "/wallet", element: <WalletPage /> },      
      
      { path: "/account", element: <div className="p-10 text-center">My Account</div> },
      
      { path: "/payment", element: <PaymentPage /> },
      { path: "/payment/success", element: <PaymentSuccess /> },
      { path: "/payment/failed", element: <PaymentFailed /> },

      // Password Reset Flow
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/verify-code", element: <VerifyCodePage /> },
      { path: "/set-new-password", element: <SetPasswordPage /> },
      { path: "/set-new-password", element: <SetNewPasswordPage /> },
      { path: "/reset-success", element: <ResetSuccessPage /> },

      // Competition & Report Issue Routes
      { path: "/report-issue", element: <ReportIssue /> },
      { path: "/competition/register", element: <RegisterCompetitionPage /> },
      { path: "/competition/confirmation", element: <ConfirmationPage /> },

      { path: "*", element: <Navigate to="/" replace /> }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;