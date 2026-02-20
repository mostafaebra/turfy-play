import axios from "axios";

// Updated server URL
const API_URL = "http://turfyplaylite.runasp.net/Turfy";

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
  
  //  Used Nackname with 'a' according to project Swagger
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

  // Updated Endpoint from Console image
  const response = await API.post("/BookCompetitionEndpoint/Handle", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};

export const getConfirmationDetails = async (id) => {
  //  /Handle?id=123
  const response = await API.get(`/GetConfirmCompetitionEndpoint/Handle`, {
    params: { id: id } 
  });
  return response.data;
};

export default API;