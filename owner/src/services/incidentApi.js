import API from './api';

export const fetchIncidentBookingInfo = async (bookingId) => {
  const response = await API.get(`/Turfy/GetIssuePageEndpoint/Execute?BookingId=${bookingId}`);
  return response.data;
};

export const submitIncidentReport = async (formData) => {
  const response = await API.post("/Turfy/CreateIssueEndpoint/Handle", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};