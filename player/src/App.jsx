import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import Home from "./pages/home/home.jsx";
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import Filterpage from "./pages/filterpage/filterpage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The "index" route - what you see at http://localhost:5173/ */}
        <Route path="/" element={<Filterpage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Catch-all: Redirect unknown URLs back to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
