import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import Home from "./pages/home/home.jsx";
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import Filterpage from "./pages/filterpage/filterpage.jsx";
import FieldDetails from './pages/FieldDetails/FieldDetails.jsx';
import BookingPage from './pages/Booking/BookingPage';
import ReportIssue from './pages/ReportIssue/ReportIssue.jsx' 

function App() {
  return (
    <Routes>

      <Route path="/" element={<Filterpage />} />

      <Route path="/details/:id" element={<FieldDetails />} />     
      
      <Route path="/booking" element={<BookingPage />} />

      {/* 👇👇 ضيف السطر ده هنا 👇👇 */}
      <Route path="/report-issue" element={<ReportIssue />} />

      {/* خلي بالك: السطر بتاع النجمة (*) ده لازم يفضل آخر واحد دايماً */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;