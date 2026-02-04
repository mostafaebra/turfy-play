/**
 * Service for handling field booking operations
 */
const BASE_URL = 'http://turfyplaydev.runasp.net/Turfy';

export const bookingApi = {
    /**
     * Fetches field details and availability
     * @param {number|string} id - Field ID
     * @param {string} date - ISO Date string (YYYY-MM-DD)
     */
    getFieldAvailability: async (id, date) => {
        try {
            const response = await fetch(`${BASE_URL}/BookingPageEndpoint/Handle?Id=${id}&Date=${date}`);
            if (!response.ok) throw new Error('Failed to fetch availability');
            return await response.json();
        } catch (error) {
            console.error("Error fetching field data:", error);
            throw error;
        }
    },

    /**
     * Submits the final booking request
     * @param {Object} bookingData - The payload matching the required post shape
     */
    bookField: async (bookingData) => {
        try {
            const response = await fetch(`${BASE_URL}/BookFieldEndpoint/Handle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            if (!response.ok) throw new Error('Booking failed');
            return await response.json();
        } catch (error) {
            console.error("Booking error:", error);
            throw error;
        }
    }
};