import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import your pages
 
 
import Home from './pages/home/home.jsx';
import Ownerlogin from "./pages/Ownerlogin/Ownerlogin.jsx";
import Ownersignup from "./pages/Ownersignup/Ownersignup.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The "index" route - what you see at http://localhost:5173/ */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        
        <Route path="/Ownerlogin" element={<Ownerlogin/>} />
         <Route path="/Ownersignup" element={<Ownersignup/>} />

        {/* Catch-all: Redirect unknown URLs back to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
