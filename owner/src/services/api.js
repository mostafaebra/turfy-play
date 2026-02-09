import axios from "axios";

// 1. الرابط الأساسي (بتاع وفاء - Schedule & Auth)
const API_URL = "http://turfywafaa.runasp.net/Turfy";

// 2. إعداد Axios
const API = axios.create({
  baseURL: API_URL,
});

// 3. Interceptor لإضافة التوكن أوتوماتيكياً لأي ريكويست
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
// 1️⃣ Auth Services (تسجيل الدخول وإنشاء الحساب)
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

  // لاحظ هنا بنستخدم axios المباشر عشان الرابط ممكن يختلف أو يكون فيه تخصيص
  const res = await axios.post(`${API_URL}/registerownerendpoint/execute`, formData);
  return res.data;
};

// ============================================================
// 2️⃣ Schedule & Fields Services (الملاعب والجدول - وفاء)
// ============================================================

export const getOwnerFields = async () => {
  try {
    const response = await API.get("/GetFieldsByOwnerEndpoint/GetFieldsByOwner");
    return response.data; 
  } catch (error) {
    console.error("❌ Error getting fields:", error);
    throw error;
  }
};

export const getFieldSchedule = async (fieldId, date) => {
  try {
    // بنبعت البارامترز في الـ Query String
    const response = await API.get("/GetFieldScheduleEndpoint/GetSchedule", {
      params: {
        FieldId: fieldId,
        Date: date
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching schedule:", error);
    throw error;
  }
};

// ============================================================
// 3️⃣ Offline Booking Actions (إضافة حجز كاش - زياد)
// ============================================================

export const addOfflineBooking = async (bookingData) => {
  // رابط زياد المباشر (Server 2)
  const OFFLINE_API_URL = "http://turfyplaylite.runasp.net/Turfy/AddOfflineBookEndpoint/Handle";
  
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(OFFLINE_API_URL, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`, // التوكن ضروري هنا
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error adding offline booking:", error);
    throw error;
  }
};