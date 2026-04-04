import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- Auth Pages ---
import Ownerlogin from "./pages/Ownerlogin/Ownerlogin.jsx";
import OwnerSignUp from "./pages/Ownersignup/Ownersignup.jsx";

// --- Layouts ---
import OwnerLayout from './layouts/OwnerLayout.jsx';

// --- Dashboard & Core Features (from main) ---
import Dashboard from './pages/Dashboard/DashboardPage.jsx';
import FinancialsPage from './pages/Financials/FinancialsPage.jsx';
import MyFieldsPage from './pages/Fields/MyFieldsPage.jsx';
import SchedulePage from './pages/Schedule/SchedulePage';
import AddNewField from "./pages/addNewField/AddNewField.jsx";

// --- Settings & Refactored Pages (from feature-auth) ---
import OwnerSettings from "./pages/OwnerSettings/OwnerSettings.jsx";
import IncidentReport from "./pages/Reportsforowner/IncidentReport.jsx"; 
import OwnerNotifications from "./pages/ownerNotifications/OwnerNotifications.jsx";
import LoyaltyDashboard from "./pages/LoyaltyDashboard/LoyaltyDashboard.jsx"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (بدون سايد بار) */}
        <Route path="/Ownerlogin" element={<Ownerlogin />} />
        <Route path="/Ownersignup" element={<OwnerSignUp />} />

        {/* Protected Routes */}
        <Route element={<OwnerLayout />}>
          
          {/* Main Pages */}
          <Route path="/" element={<Dashboard />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-field" element={<AddNewField />} /> 
          <Route path="/financials" element={<FinancialsPage />} />
          <Route path="/my-fields" element={<MyFieldsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />

          {/* Refactored Pages */}
          <Route path="/settings" element={<OwnerSettings />} />
          <Route path="/ownerreport" element={<IncidentReport />} />
          <Route path="/notifications" element={<OwnerNotifications />} />
          <Route path="/loyalty" element={<LoyaltyDashboard />} />
          
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;