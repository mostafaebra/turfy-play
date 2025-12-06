import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import AddNewField from "./pages/addNewField/AddNewField.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The "index" route - what you see at http://localhost:5173/ */}
        <Route path="addNewField/AddNewField.jsx" element={<AddNewField />} />

        {/* Auth Routes */}
       
        <Route path="/" element={<AddNewField />} />

        {/* Catch-all: Redirect unknown URLs back to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
