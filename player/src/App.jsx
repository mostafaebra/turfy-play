import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import Home from "./pages/home/home.jsx";
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import Filterpage from "./pages/filterpage/filterpage.jsx";
import FieldDetails from './pages/FieldDetails/FieldDetails.jsx';
import BookingPage from './pages/Booking/BookingPage';

function App() {
  return (
    <Routes>
      {/* 👇 1. دي الخطوة المهمة: الصفحة الرئيسية تفتح الفلتر */}
      <Route path="/" element={<Filterpage />} />

      {/* 2. صفحة التفاصيل جاهزة تستقبل الـ ID */}
      <Route path="/details/:id" element={<FieldDetails />} />     
      
      <Route path="/booking" element={<BookingPage />} />

      {/* Catch-all: أي رابط غلط يرجع للرئيسية (الفلتر) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;