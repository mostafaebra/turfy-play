import API from './api'; 


//  Schedule & Fields Services

export const getOwnerFields = async () => {
  const response = await API.get("/Turfy/GetFieldsByOwnerEndpoint/GetFieldsByOwner");
  return response.data; 
};

export const getFieldSchedule = async (fieldId, date) => {
  const response = await API.get("/Turfy/GetFieldScheduleEndpoint/GetSchedule", {
    params: { FieldId: fieldId, Date: date, _t: new Date().getTime() }
  });
  return response.data;
};


//  Offline Booking Actions 

export const addOfflineBooking = async (bookingData) => {
  const response = await API.post("/Turfy/AddOfflineBookEndpoint/Handle", bookingData);
  return response.data;
};

export const getOfflineBookingDetails = async (bookedSlotId) => {
  const response = await API.get("/Turfy/GetOfflineBookEndpoint/Handle", {
    params: { BookedSlotId: bookedSlotId }
  });
  return response.data;
};

export const updateOfflineBooking = async (bookingData) => {
  const response = await API.post("/Turfy/UpdateOfflineBookingEndpoint/Handle", bookingData);
  return response.data;
};

export const deleteOfflineBooking = async (bookingPayload) => {
  const response = await API.delete("/Turfy/DeleteOfflineBookEndpoint/Handle", {
    data: bookingPayload 
  });
  return response.data;
};


//  Online Booking Actions (Verify / Reject)

export const getOnlineBookingDetails = async (bookedSlotId) => {
  try {
    const response = await API.get("/Turfy/GetOnlineBookEndpoint/Handle", {
      params: { BookedSlotId: bookedSlotId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching online booking details:", error);
    throw error;
  }
};

export const approveBooking = async (bookedSlotId) => {
  try {
    const response = await API.post("/Turfy/ApproveBookingEndpoint/Handle", { 
        bookedSlotId: bookedSlotId 
    });
    return response.data;
  } catch (error) {
    console.error("Error approving booking:", error);
    throw error;
  }
};

export const rejectBooking = async (bookedSlotId) => {
  try {
    const response = await API.post("/Turfy/RejectBookingEndpoint/Handle", { 
        bookedSlotId: bookedSlotId 
    });
    return response.data;
  } catch (error) {
    console.error("Error rejecting booking:", error);
    throw error;
  }
};