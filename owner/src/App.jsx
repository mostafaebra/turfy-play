import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AddNewField from "./pages/addNewField/AddNewField.jsx";
import Ownerlogin from "./pages/Ownerlogin/Ownerlogin.jsx";
import OwnerSignUp from "./pages/Ownersignup/Ownersignup.jsx";
import SchedulePage from "./pages/Schedule/SchedulePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route (Login) */}
        <Route path="/" element={<Ownerlogin />} />

        {/* Authentication Routes */}
        <Route path="/Ownerlogin" element={<Ownerlogin />} />
        <Route path="/Ownersignup" element={<OwnerSignUp />} />

        {/* Schedule Page */}
        <Route path="/schedule" element={<SchedulePage />} />

        {/* Add New Field Page */}
        <Route path="/add-field" element={<AddNewField />} />

        {/* Catch-all redirect to home/login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;