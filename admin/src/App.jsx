import React from "react";

// Import your pages
import Home from "./pages/home/home.jsx";
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import AdminCreatecmpetion from "./pages/competition/AdminCreatecmpetion.jsx";
import VoucherPage from "./pages/voucherpage/VoucherPage.jsx";
import CreateVoucherPage from "./pages/voucherpage/CreateVoucherPage.jsx";
import CreateVenueOfferPage from "./pages/voucherpage/CreateVenueOfferPage.jsx";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout"; // Import Layout here
import EditVoucherPage from "./pages/voucherpage/EditVoucherPage.jsx";
// Layout Wrapper Component
const LayoutWrapper = () => (
  <MainLayout>
    <Outlet /> {/* This renders the child route (e.g. VoucherPage) */}
  </MainLayout>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (No Sidebar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected/Admin Routes (With Sidebar) */}
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<AdminCreatecmpetion />} />
          <Route path="/home" element={<Home />} />
          <Route path="/voucher" element={<VoucherPage />} />
          <Route path="/edit-voucher/:id" element={<EditVoucherPage />} />
          <Route path="/create-voucher" element={<CreateVoucherPage />} />
          <Route path="/create-venue-offer" element={<CreateVenueOfferPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
