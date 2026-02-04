import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Pages
import Filterpage from './pages/filterpage/filterpage.jsx';
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import FieldDetails from './pages/FieldDetails/FieldDetails.jsx';
import ForgotPassword from "./pages/PasswordReset/ForgetPassword.jsx";
import WalletPage from "./pages/account/WalletPage.jsx"

import BookingPage from "./pages/Booking/BookingPage.jsx"; 

// --- ROOT LAYOUT ---
const RootLayout = () => {
  return (
    <div className="antialiased text-slate-900">
      <Outlet />
    </div>
  );
};

// --- ROUTER CONFIGURATION ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Filterpage />, // Landing Page
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/details/:id",
        element: <FieldDetails />,
      },
      // 👇 THIS IS THE MISSING ROUTE 👇
      {
        path: "/booking/:id/:date",
        element: <BookingPage />,
      },
      // 👆 -------------------------- 👆
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/bookings",
        element: <div className="p-10 text-center">My Bookings Page (Coming Soon)</div>,
      },
      {
        path: "/wallet",
        element: <WalletPage/>,
      },
      {
        path: "/account",
        element: <div className="p-10 text-center">My Account Page (Coming Soon)</div>, 
      },
      // Catch-all route: redirects unknown paths to home
      {
        path: "*",
        element: <Navigate to="/" replace />,
      }
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