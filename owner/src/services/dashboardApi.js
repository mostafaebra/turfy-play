import API from './api'; 

export const fetchFieldDashboardOverview = async (fieldId) => {
  try {
    
    const response = await API.get(`/Turfy/GetFieldDashboardOverviewEndpoint/Handle/${fieldId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    throw error;
  }
};

export const fetchOwnerFields = async () => {
  try {
    const response = await API.get('/Turfy/GetFieldsByOwnerEndpoint/GetFieldsByOwner');
    return response.data;
  } catch (error) {
    console.error("Error fetching owner fields:", error);
    throw error;
  }
};