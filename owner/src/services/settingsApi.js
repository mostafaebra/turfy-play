// src/services/settingsApi.js
import API from './api';

// ==========================================
// 1. Profile Tab APIs

export const fetchOwnerProfile = async () => {
  const response = await API.get("/Turfy/GetOwnerInfoEndPoint/GetInfo");
  return response.data;
};

export const updateOwnerProfile = async (formData) => {
  const response = await API.patch("/Turfy/UpdateOwnerInfoEndpoint/UpdateProfile", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// ==========================================
// 2. Bank Details Tab APIs

export const fetchPayoutDetails = async () => {
  const response = await API.get("/Turfy/GetOwnerPayoutDetailsEndpoint/GetPayoutDetails");
  return response.data;
};

export const updatePayoutDetails = async (payoutData) => {
  const response = await API.patch("/Turfy/UpdateOwnerPayoutDetailsEndpoint/UpdatePayoutDetails", payoutData);
  return response.data;
};

// ==========================================
// 3. Notifications Tab APIs

export const fetchNotificationSettings = async () => {
  const response = await API.get("/Turfy/OwnerNotificationSettingsEndpoint/GetSettings");
  return response.data;
};

export const updateNotificationSettings = async (settingsData) => {
  const response = await API.patch("/Turfy/OwnerNotificationSettingsEndpoint/UpdateSettings", settingsData);
  return response.data;
};

// ==========================================
// 4. Security Tab APIs

export const changeOwnerPassword = async (passwordData) => {
  const response = await API.post("/Turfy/ChangePasswordEndpoint/ChangePassword", passwordData);
  return response.data;
};