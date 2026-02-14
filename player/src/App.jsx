import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Pages
import Filterpage from './pages/filterpage/filterpage.jsx';
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import FieldDetails from './pages/FieldDetails/FieldDetails.jsx';
import ForgotPassword from "./pages/PasswordReset/ForgetPassword.jsx";

// --- CHECK THESE IMPORTS CAREFULLY ---
import WalletPage from "./pages/account/WalletPage.jsx"; // Ensure this file exists
import MyBookingsPage from "./pages/Bookings/MyBookingsPage.jsx"; // Ensure this is DIFFERENT from WalletPage
import BookingPage from "./pages/Booking/BookingPage.jsx"; 

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
      
      { path: "/booking/:id", element: <BookingPage /> }, // The Calendar Page
      
      { path: "/bookings", element: <MyBookingsPage /> }, // The List Page
      { path: "/wallet", element: <WalletPage /> },       // The Wallet Page
      
      { path: "/account", element: <div className="p-10 text-center">My Account</div> },
      
      { path: "/payment", element: <PaymentPage /> },
      { path: "/payment/success", element: <PaymentSuccess /> },
      { path: "/payment/failed", element: <PaymentFailed /> },

      { path: "/forgot-password", element: <ForgotPassword /> },
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