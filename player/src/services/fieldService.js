import axios from 'axios';

const BASE_URL = "http://turfywafaa.runasp.net/Turfy/FilterFieldsEndpoint/Filter";


const SPORT_TYPE_MAP = {
  "Soccer": 0, // Football in C# 
  "Football": 0, // UI uses "Football" but API expects "Soccer" (0)
  "Basketball": 1,
  "Tennis": 2,
  "Volleyball": 3,
  "Padel": 4,
  "Paddel": 4, // UI uses "Paddel" but API expects "Padel" (4)
  "Squash": 5
};

// Reverse mapping: byte to sport name (for displaying in UI)
const SPORT_TYPE_REVERSE_MAP = {
  0: "Football", // Show as "Football" in UI
  1: "Basketball",
  2: "Tennis",
  3: "Volleyball",
  4: "Padel",
  5: "Squash"
};

// Helper function to convert sport type byte to sport name
export const getSportNameFromByte = (sportTypeByte) => {
  if (sportTypeByte === null || sportTypeByte === undefined) return null;
  return SPORT_TYPE_REVERSE_MAP[sportTypeByte] || null;
};

const SORT_BY_MAP = {
  "Best Match": 0,
  "Lowest Price": 1, // PriceAsc
  "Highest Price": 2, // PriceDesc
  "Highest Rated": 3, // Rating
  "Nearest to Me": 4  // Distance
};

// Use POST method instead of GET as requested
export const fetchFilteredFields = async (filters, cursor = null) => {
  try {
    // Only send lat/lng when "Nearest to Me" sort is selected (sortBy = 4)
    // Don't send user location for text-based location searches
    const isNearestSort = SORT_BY_MAP[filters.sort] === 4; // "Nearest to Me"
    const shouldSendLocation = isNearestSort && filters.lat != null && filters.lng != null;
    
    // Using camelCase as C# can deserialize both camelCase and PascalCase
    const requestData = {
      // Location - only send when "Nearest to Me" is selected and we have coordinates
      // Don't send user location for text-based searches
      lat: shouldSendLocation ? filters.lat : null,
      lng: shouldSendLocation ? filters.lng : null,
      
      // Sport Type (can be null)
      sportType: filters.type && SPORT_TYPE_MAP[filters.type] !== undefined 
        ? SPORT_TYPE_MAP[filters.type] 
        : null,
      
      // Price Range (can be null)
      priceStart: filters.priceMin ? parseFloat(filters.priceMin) : null,
      priceEnd: filters.priceMax ? parseFloat(filters.priceMax) : null,
      
      // Rating (can be null)
      Rating: filters.rating && filters.rating !== 'Any' && filters.rating !== '' 
        ? parseFloat(filters.rating) 
        : null,
      
      // Sort By (required, default to 0)
      sortBy: SORT_BY_MAP[filters.sort] ?? 0,
      
      // Cursor Pagination fields (can be null)
      lastCursorValue: cursor?.value ?? null,
      lastId: cursor?.id ?? null,
      
      // Limit (required)
      limit: 8
    };

    // Wrap in requestData as required by backend
    const requestBody = {
      requestData: requestData
    };

    console.log('=== API REQUEST ===');
    console.log('URL:', BASE_URL);
    console.log('Method: POST');
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    console.log('==================');

    // Always use POST, never GET
    const response = await axios.post(BASE_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('=== API RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    console.log('Response Headers:', response.headers);
    console.log('===================');

    /**
     * The response follows CursorPage<T>:
     * { items: [], nextCursorValue: "", nextCursorTieBreakerId: 0, hasMore: true }
     * 
     * OR it might be wrapped in a data property:
     * { data: { items: [], ... } }
     */
    
    // Handle different response structures
    let responseData = response.data;
    
    // If response is wrapped in 'data' property
    if (responseData && responseData.data && !responseData.items) {
      responseData = responseData.data;
    }
    
    // Ensure items is an array
    if (!Array.isArray(responseData.items)) {
      console.warn('Response items is not an array:', responseData.items);
      responseData.items = [];
    }

    return responseData;
  } catch (error) {
    console.error("=== API ERROR ===");
    console.error("Error Message:", error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response Status:", error.response.status);
      console.error("Response Status Text:", error.response.statusText);
      console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
      console.error("Response Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received. Request:", error.request);
      console.error("This could be a CORS issue or network problem");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
    console.error("=================");
    
    throw error;
  }
};