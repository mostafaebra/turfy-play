import API from "./api"; 

export const createFieldRequest = async (formData) => {
  const response = await API.post(
    "/Turfy/FieldCreateEndpoint/Handle", 
    formData

  );

  return response.data;
};