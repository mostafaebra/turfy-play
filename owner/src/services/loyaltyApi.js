// src/services/loyaltyApi.js
import API from './api';

export const fetchLoyaltyDashboard = async (fieldId = 1) => { 
  try {
    const response = await API.get(`/Turfy/GetLoyaltyDashboardEndpoint/GetDashboard/${fieldId}`);
    return response.data;
  } catch (error) {
    console.error("Loyalty Fetch Error:", error);
    throw error;
  }
};