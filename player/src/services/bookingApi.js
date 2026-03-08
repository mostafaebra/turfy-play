import { api } from './api'; // Use custom instance

// --- CONSTANTS & ENDPOINTS ---
const BASE_URL = "http://turfywafaa.runasp.net/Turfy/FilterFieldsEndpoint/Filter";
const DETAILS_URL = "http://turfy.runasp.net/Turfy/GetByIdFieldEndpoint/Execute";
const BOOKING_ACTION_URL = "http://turfy.runasp.net/Turfy/BookFieldEndpoint/Handle"; 
const BOOKING_PAGE_URL = "http://turfy.runasp.net/Turfy/BookingPageEndpoint/Handle"; 
const CONFIRM_BOOKING_URL = "http://turfy.runasp.net/Turfy/GetConfirmBookingPageEndpoint/Handle";
const GET_PLAYER_BOOKINGS_URL = "http://turfy.runasp.net/Turfy/GetPlayerBookingsEndpoint/Execute";

// --- MAPPINGS ---
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

// --- HELPER FUNCTIONS ---
export const getSportNameFromByte = (byteValue) => {
  if (byteValue === null || byteValue === undefined) return null;
  return SPORT_TYPE_REVERSE_MAP[byteValue] || null;
};

// --- API EXPORTS ---

export const fetchFilteredFields = async (filters, cursor = null) => {
  try {
    const sortValue = SORT_BY_MAP[filters.sort] ?? 0;
    const shouldSendLocation = filters.lat != null && filters.lng != null;
    
    const requestData = {
      search: filters.search || null,
      lat: shouldSendLocation ? filters.lat : null,
      lng: shouldSendLocation ? filters.lng : null,
      sportType: filters.type && SPORT_TYPE_MAP[filters.type] !== undefined ? SPORT_TYPE_MAP[filters.type] : null,
      priceStart: filters.priceMin ? parseFloat(filters.priceMin) : null,
      priceEnd: filters.priceMax ? parseFloat(filters.priceMax) : null,
      Rating: filters.rating && filters.rating !== 'Any' && filters.rating !== '' ? parseFloat(filters.rating) : null,
      sortBy: sortValue,
      lastCursorValue: cursor?.value ?? null,
      lastId: cursor?.id ?? null,
      limit: 8
    };

    // Switched to api.post
    const response = await api.post(BASE_URL, { requestData });

    let responseData = response.data;
    if (responseData && responseData.data && !responseData.items) {
      responseData = responseData.data;
    }
    if (!Array.isArray(responseData.items)) {
      responseData.items = [];
    }
    return responseData;
  } catch (error) {
    console.error("API Error (fetchFilteredFields):", error);
    throw error;
  }
};

export const getFieldDetails = async (id) => {
  try {
      const response = await api.get(DETAILS_URL, { params: { FieldId: id } });
      return response.data; 
  } catch (error) {
      console.error("API Error (getFieldDetails):", error);
      throw error;
  }
};

export const bookingApi = {
  
  // A. Get Availability
  getFieldAvailability: async (id, date) => {
      try {
          // No manual token needed. api.get handles it.
          const response = await api.get(BOOKING_PAGE_URL, {
              params: { Id: id, Date: date }
          });
          return response.data;
      } catch (error) {
          console.error("API Error (getFieldAvailability):", error);
          throw error;
      }
  },

  // B. Initiate Booking
  bookField: async (payload) => {
    try {
      const response = await api.post(BOOKING_ACTION_URL, payload);
      return response.data; 
    } catch (error) {
      console.error("Booking API Error:", error);
      throw error;
    }
  },

  // C. Confirm Booking
  getBookingConfirmation: async (bookingId) => {
    try {
        const response = await api.get(CONFIRM_BOOKING_URL, {
            params: { BookingId: bookingId }
        });
        return response.data;
    } catch (error) {
        console.error("API Error (getBookingConfirmation):", error);
        throw error;
    }
  },

  // E. Get Player Bookings
  getPlayerBookings: async (type, cursor = null, limit = 10) => {
    try {
        // Removed localStorage.getItem('token')
        const payload = {
            type: type, // 1 = Upcoming, 2 = History
            limit: limit,
            cursor: cursor
        };

        const response = await api.post(GET_PLAYER_BOOKINGS_URL, payload);
        return response.data;
    } catch (error) {
        console.error("API Error (getPlayerBookings):", error);
        throw error;
    }
  },

  getBookingSummary: async (bookingId) => {
      return { basePrice: 0, serviceFee: 0, walletBalance: 0 };
  }
};