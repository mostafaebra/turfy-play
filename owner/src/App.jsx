import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import AddNewField from "./pages/addNewField/AddNewField.jsx";
import Ownerlogin from "./pages/Ownerlogin/Ownerlogin.jsx";
import OwnerSignUp from "./pages/Ownersignup/Ownersignup.jsx";
import FinancialsPage from './pages/Financials/FinancialsPage.jsx';
import MyFieldsPage from './pages/Fields/MyFieldsPage.jsx';
import Dashboard from './pages/Dashboard/DashboardPage.jsx';
import SchedulePage from './pages/Schedule/SchedulePage';

// Layouts
import OwnerLayout from './layouts/OwnerLayout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/Ownerlogin" element={<Ownerlogin />} />
        <Route path="/Ownersignup" element={<OwnerSignUp />} />

        <Route element={<OwnerLayout />}>
          <Route path="/" element={<AddNewField />} /> 
          <Route path="/add-field" element={<AddNewField />} /> 
          <Route path="/financials" element={<FinancialsPage />} />
          <Route path="/my-fields" element={<MyFieldsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;