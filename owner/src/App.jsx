import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

 
import AddNewField from "./pages/addNewField/AddNewField.jsx";
import Ownerlogin from "./pages/Ownerlogin/Ownerlogin.jsx";
import OwnerSignUp from "./pages/Ownersignup/Ownersignup.jsx";
import OwnerSettings from "./pages/OwnerSettings/OwnerSettings.jsx";
import IncidentReport from "./pages/Reportsforowner/IncidentReport.jsx"; 
import OwnerNotifications from "./pages/ownerNotifications/OwnerNotifications.jsx";
import LoyaltyDashboard from "./pages/LoyaltyDashboard/LoyaltyDashboard.jsx"; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        { }
        <Route path="/" element={<AddNewField />} />
        <Route path="/addNewField" element={<AddNewField />} /> 

        { }
        <Route path="/Ownerlogin" element={<Ownerlogin />} />
        <Route path="/Ownersignup" element={<OwnerSignUp />} />

        { }
        <Route path="/settings" element={<OwnerSettings />} />

        { }
        <Route path="/ownerreport" element={<IncidentReport />} />
        
        <Route path="/notifications" element={<OwnerNotifications />} />
        
        <Route path="/loyalty" element={<LoyaltyDashboard />} />
        

        { }
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;