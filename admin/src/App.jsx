import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import Home from "./pages/home/home.jsx";
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import AdminCreatecmpetion from "./pages/competition/AdminCreatecmpetion.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The "index" route - what you see at http://localhost:5173/ */}
        <Route path="/" element={<AdminCreatecmpetion />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* Catch-all: Redirect unknown URLs back to Home */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
