import axios from 'axios';

const BASE_URL = "http://turfywafaa.runasp.net/Turfy/FilterFieldsEndpoint/Filter";
const DETAILS_URL = "http://turfy.runasp.net/Turfy/GetByIdFieldEndpoint/Execute";

const SPORT_TYPE_MAP = {
  "Soccer": 0, "Football": 0, "Basketball": 1, "Tennis": 2,
  "Volleyball": 3, "Padel": 4, "Paddel": 4, "Squash": 5
};

const SPORT_TYPE_REVERSE_MAP = {
  0: "Football", 1: "Basketball", 2: "Tennis", 3: "Volleyball", 4: "Padel", 5: "Squash"
};

const SORT_BY_MAP = {
  "Best Match": 0, "Lowest Price": 1, "Highest Price": 2, "Highest Rated": 3, "Nearest to Me": 4
};

export const getSportNameFromByte = (byteValue) => {
  if (byteValue === null || byteValue === undefined) return null;
  return SPORT_TYPE_REVERSE_MAP[byteValue] || null;
};

export const fetchFilteredFields = async (filters, cursor = null) => {
  try {
    const sortValue = SORT_BY_MAP[filters.sort] ?? 0;
    
    // --- FIX 1: Always send location if available (Fixes missing distance) ---
    const shouldSendLocation = filters.lat != null && filters.lng != null;
    
    const requestData = {
      // --- FIX 2: Add Search Term (Fixes search not working) ---
      search: filters.search || null,

      lat: shouldSendLocation ? filters.lat : null,
      lng: shouldSendLocation ? filters.lng : null,
      
      sportType: filters.type && SPORT_TYPE_MAP[filters.type] !== undefined 
        ? SPORT_TYPE_MAP[filters.type] 
        : null,
      
      priceStart: filters.priceMin ? parseFloat(filters.priceMin) : null,
      priceEnd: filters.priceMax ? parseFloat(filters.priceMax) : null,
      
      Rating: filters.rating && filters.rating !== 'Any' && filters.rating !== '' 
        ? parseFloat(filters.rating) 
        : null,
      
      sortBy: sortValue,
      
      lastCursorValue: cursor?.value ?? null,
      lastId: cursor?.id ?? null,
      limit: 8
    };

    const requestBody = { requestData: requestData };

    const response = await axios.post(BASE_URL, requestBody, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });

    let responseData = response.data;
    if (responseData && responseData.data && !responseData.items) {
      responseData = responseData.data;
    }
    
    if (!Array.isArray(responseData.items)) {
      responseData.items = [];
    }

    return responseData;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getFieldDetails = async (id) => {
    try {
        const response = await axios.get(DETAILS_URL, { params: { FieldId: id } });
        return response.data; 
    } catch (error) {
        console.error("API Error Link:", DETAILS_URL);
        throw error;
    }
}