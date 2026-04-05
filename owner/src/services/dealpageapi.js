// src/services/dealpageapi.js

const BASE_URL = 'http://turfyplaydev.runasp.net/Turfy';

/**
 * Fetches the venue offer details by ID.
 * @param {number|string} id - The ID of the deal to fetch.
 * @returns {Promise<Object>} The deal data.
 */
export const fetchDealDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/GetVenueOfferDetailsEndpoint/Handle?id=${id}`, { method: 'GET' });
    if (!response.ok) throw new Error('Failed to fetch deal details');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching deal details:", error);
    throw error;
  }
};

/**
 * Approves or rejects a deal.
 * @param {Object} payload - { id, venueOfferId, approve }
 * @returns {Promise<Object>} The API response.
 */
export const updateDealStatus = async ({ id, venueOfferId, approve }) => {
  try {
    const response = await fetch(`${BASE_URL}/UpdateVenueOfferRequestEndpoint/Handle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        venueOfferId: venueOfferId,
        approve: approve,
      }),
    });

    if (!response.ok) throw new Error(`Failed to ${approve ? 'approve' : 'reject'} the deal`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating deal status:`, error);
    throw error;
  }
};