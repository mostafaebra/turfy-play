import axios from "axios";

// Base API URL
// Switch between servers if needed (e.g., TurfyPlayLite vs TurfyWafaa)
const API_URL = "http://turfywafaa.runasp.net/Turfy";

// Axios instance setup
const API = axios.create({
  baseURL: API_URL,
});

// Interceptor to add Authorization Token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ============================================================
//  Auth Services
// ============================================================

export const ownerLogin = async (email, password) => {
  const response = await API.post("/LoginUserEndpoint/Handle", {
    emailOrPhone: email,
    password: password,
    discriminator: 2, 
  });
  return response.data;
};

export const ownerSignup = async (data) => {
  const formData = new FormData();
  formData.append("FullName", data.fullName);
  formData.append("Password", data.password);
  formData.append("ConfirmPassword", data.confirmPassword);
  formData.append("PhoneNumber", data.phoneNumber);
  formData.append("Email", data.email);
  
  if(data.frontCardImage) formData.append("FrontCardImage", data.frontCardImage);
  if(data.backCardImage) formData.append("BackCardImage", data.backCardImage);

  const res = await API.post("/registerownerendpoint/execute", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

// ============================================================
//  Schedule & Fields Services
// ============================================================

export const getOwnerFields = async () => {
  const response = await API.get("/GetFieldsByOwnerEndpoint/GetFieldsByOwner");
  return response.data; 
};

export const getFieldSchedule = async (fieldId, date) => {
  // Added timestamp to prevent caching
  const response = await API.get("/GetFieldScheduleEndpoint/GetSchedule", {
    params: { FieldId: fieldId, Date: date, _t: new Date().getTime() }
  });
  return response.data;
};

// ============================================================
//  Offline Booking Actions (CRUD)
// ============================================================

export const addOfflineBooking = async (bookingData) => {
  const response = await API.post("/AddOfflineBookEndpoint/Handle", bookingData);
  return response.data;
};

export const getOfflineBookingDetails = async (bookedSlotId) => {
  const response = await API.get("/GetOfflineBookEndpoint/Handle", {
    params: { BookedSlotId: bookedSlotId }
  });
  return response.data;
};

export const updateOfflineBooking = async (bookingData) => {
  // Using POST based on backend requirement
  const response = await API.post("/UpdateOfflineBookingEndpoint/Handle", bookingData);
  return response.data;
};

export const deleteOfflineBooking = async (bookingPayload) => {
  const response = await API.delete("/DeleteOfflineBookEndpoint/Handle", {
    data: bookingPayload 
  });
  return response.data;
};

// ============================================================
//  Online Booking Actions (Verify / Reject)
// ============================================================

// Fetch details for online booking requests
export const getOnlineBookingDetails = async (bookedSlotId) => {
  try {
    const response = await API.get("/GetOnlineBookEndpoint/Handle", {
      params: { BookedSlotId: bookedSlotId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching online booking details:", error);
    throw error;
  }
};

// Approve an online booking request
export const approveBooking = async (bookedSlotId) => {
  try {
    const response = await API.post("/ApproveBookingEndpoint/Handle", { 
        bookedSlotId: bookedSlotId 
    });
    return response.data;
  } catch (error) {
    console.error("Error approving booking:", error);
    throw error;
  }
};

// Reject an online booking request
export const rejectBooking = async (bookedSlotId) => {
  try {
    const response = await API.post("/RejectBookingEndpoint/Handle", { 
        bookedSlotId: bookedSlotId 
    });
    return response.data;
  } catch (error) {
    console.error("Error rejecting booking:", error);
    throw error;
  }
};

export default API;