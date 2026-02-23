import axios from "axios";

// Updated server URL (Ensure /Turfy is included)
const API_URL = "http://turfy.runasp.net/Turfy";

const API = axios.create({
  baseURL: API_URL,
});

// Interceptor to automatically add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Book Competition function
 * @param {Object} data - Collected form data
 */
export const registerTeamInCompetition = async (data) => {
  const formData = new FormData();
  
  // 1. Basic data (Ensure PascalCase for Keys)
  formData.append("CompetitionId", Number(data.competitionId)); 
  formData.append("TeamName", data.teamName);
  
  formData.append("TeamNackname", data.teamNickname || ""); 
  
  formData.append("TeamCaptain", data.teamCaptain);
  
  // 2. Upload file (Logo)
  if (data.teamLogo) {
    formData.append("TeamLogo", data.teamLogo);
  }

  // 3. Logical and financial fields
  // Server expects Boolean, sending as string "true"/"false" in multipart
  formData.append("IsWalletUsed", data.useWallet ? "true" : "false");
  formData.append("Price", Number(data.price));
  
  // 4. Payment method (1 = Credit Card, 2 = Fawry)
  const pMethod = data.paymentMethod === "credit_card" ? "1" : "2";
  formData.append("PaymentMethod", pMethod); 

  // 5. Log the FormData to debug and send to backend
  console.group("🚀 Data sent to Backend (FormData)");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  console.groupEnd();

  // Endpoint call
  const response = await API.post("/BookCompetitionEndpoint/Handle", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};

export const getConfirmationDetails = async (id) => {
  // Fetch confirmation details using ID
  const response = await API.get(`/GetConfirmCompetitionEndpoint/Handle`, {
    params: { id: id } 
  });
  return response.data;
};


/*
  Submit an Issue Report function
 */
export const submitReportIssue = async (data) => {
  const formData = new FormData();
  
  // 1. Basic data based on Swagger UI
  formData.append("BookingId", data.bookingId);
  formData.append("Category", data.category); 
  formData.append("Severity", data.severity); 
  formData.append("Description", data.description);

  // 2. Upload files (IssueImages Array)
  if (data.images && data.images.length > 0) {
    data.images.forEach((img) => {
      formData.append("IssueImages", img.file); 
    });
  }

  // 3. Endpoint call
  const response = await API.post("/CreateIssueEndpoint/Handle", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};

export default API;