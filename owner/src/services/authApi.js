import API from "./api";
import { BASE_URL } from "../config";

export const ownerSignup = async (data) => {
  const formData = new FormData();

  formData.append("FullName", data.fullName);
  formData.append("Password", data.password);
  formData.append("ConfirmPassword", data.confirmPassword);
  formData.append("PhoneNumber", data.phoneNumber);
  formData.append("Email", data.email);

  if (data.frontCardImage) {
    formData.append("FrontCardImage", data.frontCardImage);
  }

  if (data.backCardImage) {
    formData.append("BackCardImage", data.backCardImage);
  }

  const res = await fetch(
    `${BASE_URL}/Turfy/registerownerendpoint/execute`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return await res.json();
};


export const ownerLogin = async (email, password) => {
  const response = await API.post("/Turfy/LoginUserEndpoint/Handle", {
    emailOrPhone: email,
    password: password,
    discriminator: 2, 
  });
  return response.data;
};