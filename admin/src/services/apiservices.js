import axios from 'axios';

const API_BASE_URL = 'http://turfyplaydev.runasp.net/Turfy';

/**
 * Creates a new competition
 */
export const createCompetition = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/CreateCompetitionEndpoint/Execute`,
      data,
      {
        headers: {
          'Accept': 'application/json' 
          // Do NOT set Content-Type here, let axios handle multipart/form-data
        },
        timeout: 30000 
      }
    );
    
    return {
      success: true,
      data: response.data,
      message: response.data?.message || 'Competition created successfully!'
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data,
        message: error.response.data?.title || 'Validation Error',
        status: error.response.status
      };
    } else {
      return {
        success: false,
        error: error.message,
        message: 'An unexpected error occurred.'
      };
    }
  }
};

/**
 * Gets field details by ID
 * THIS IS THE MISSING FUNCTION CAUSING YOUR ERROR
 */
export const getFieldById = async (fieldId) => {
  try {
    if (!fieldId) throw new Error('Field ID is required');

    const response = await axios.get(
      `${API_BASE_URL}/GetByIdFieldEndpoint/Execute`,
      {
        params: { FieldId: fieldId },
        headers: { 'Accept': 'application/json' },
        timeout: 15000
      }
    );
    
    return {
      success: true,
      data: response.data,
      message: 'Field retrieved successfully'
    };
  } catch (error) {
     if (error.response) {
        return { success: false, message: error.response.data?.message || 'Error fetching field' };
     }
     return { success: false, message: error.message };
  }
};