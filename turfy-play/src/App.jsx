import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import Home from "./pages/home/home.jsx";
import Login from "./pages/login/login.jsx";
import SignUp from "./pages/signup/signup.jsx";
import AddNewField from "./pages/addNewField/AddNewField.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The "index" route - what you see at http://localhost:5173/ */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-field" element={<AddNewField />} />

        {/* Catch-all: Redirect unknown URLs back to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
