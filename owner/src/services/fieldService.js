import axios from "axios";

const API_BASE_URL = "http://turfyplaydev.runasp.net";

export const createFieldRequest = async (formData, token) => {
  const response = await axios.post(
    `${API_BASE_URL}/Turfy/FieldCreateEndpoint/Handle`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
