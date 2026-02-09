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
        {/* 👇 1. الصفحة الرئيسية (Default Route) بقت اللوجين */}
        <Route path="/" element={<Ownerlogin />} />

        {/* 👇 2. صفحات المصادقة (Auth) */}
        <Route path="/Ownerlogin" element={<Ownerlogin />} />
        <Route path="/Ownersignup" element={<OwnerSignUp />} />

        {/* 👇 3. صفحة الجدول (Schedule) */}
        <Route path="/schedule" element={<SchedulePage />} />

        {/* 👇 4. صفحة إضافة ملعب (خليت الرابط بتاعها نضيف) */}
        <Route path="/add-field" element={<AddNewField />} />

        {/* 👇 5. لو كتب أي رابط غلط، يرجعه للوجين */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;