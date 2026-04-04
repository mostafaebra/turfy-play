

const BASE_URL = 'http://turfyplaydev.runasp.net/Turfy';

export const fetchVoucherDetails = async (id) => {
  try {
  
    const response = await fetch(`${BASE_URL}/GetVoucherDetailsEndpoint/Handle?id=${id}`, { method: 'GET' } );

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const json = await response.json();
    
    if (!json.isSuccess || !json.data) {
      throw new Error(json.message || "Invalid API response format");
    }
    
    return json.data;
  } catch (error) {
    console.error("Error fetching voucher details:", error);
    throw error;
  }
};
