import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import FieldApproval from './pages/FieldApproval/FieldApproval';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Default Route: Redirect root "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 2. Public Route: Login */}
        <Route path="/login" element={<Login />} />
        
        {/* 3. Protected Route: Dashboard (Field Approval) */}
        <Route path="/dashboard" element={<FieldApproval />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;