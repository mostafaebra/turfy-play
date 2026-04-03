import  API  from './API'; // Import your custom configured Axios instance

/**
 * Fetches the user's competitions from the backend with cursor pagination.
 * Uses the shared API instance to ensure auth headers are included.
 */
export const fetchMyCompetitions = async ({ tab = 0, lastCursorValue = null, lastId = 0, limit = 10 }) => {
    try {
        const params = {
            Tab: tab,
            Limit: limit,
            LastId: lastId || 0,
        };

        // Only append LastCursorValue if it exists to avoid sending "null" as a string
        if (lastCursorValue) {
            params.LastCursorValue = lastCursorValue;
        }

        const url = `http://turfywafaa.runasp.net/Turfy/GetMyCompetitionsEndpoint/Handle/my-competitions`;
        
        // Use API.get so auth interceptors are automatically applied
        const response = await API.get(url, { params });
        const result = response.data;

        // Check the custom isSuccess flag from your API wrapper
        if (!result.isSuccess) {
            throw new Error(result.message || 'Failed to fetch competitions');
        }

        return result.data;
    } catch (error) {
        console.error("Error fetching competitions:", error);
        throw error;
    }
};