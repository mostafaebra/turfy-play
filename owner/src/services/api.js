import axios from "axios";

// const API = axios.create({
//   baseURL: "http://turfyplaydev.runasp.net/Turfy/registerownerendpoint/execute",    
// });


// ============ SIGNUP Owner============
export const ownerSignup = async (data) => {
  const formData = new FormData();

  formData.append("FullName", data.fullName);
  formData.append("Password", data.password);
  formData.append("ConfirmPassword", data.confirmPassword);
  formData.append("PhoneNumber", data.phoneNumber);
  formData.append("Email", data.email);

  // Important → Images should be file objects, not base64
  if (data.frontCardImage) {
    formData.append("FrontCardImage", data.frontCardImage);
  }

  if (data.backCardImage) {
    formData.append("BackCardImage", data.backCardImage);
  }

  const res = await fetch(
    "http://turfyplaydev.runasp.net/Turfy/registerownerendpoint/execute",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return await res.json();
};
