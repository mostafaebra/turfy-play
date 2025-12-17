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

      <Route path="/" element={<Filterpage />} />

      <Route path="/details/:id" element={<FieldDetails />} />     
      
      <Route path="/booking" element={<BookingPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;