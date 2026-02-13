import axios from "axios";

const BASE_URL = "http://turfytesting.runasp.net/Turfy/GetAllCompetitionsEndpoint/GetAllCompetitions";

export const getAllCompetitions = async (filters) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(BASE_URL, filters, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch competitions");
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};