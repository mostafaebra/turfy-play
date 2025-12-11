import api from './api';

const FIELD_API_URL = 'http://turfy.runasp.net';

const fieldService = {
  getSubmission: async (id = 1, isNewRequest = true) => {
    const endpoint = isNewRequest 
      ? '/Turfy/GetByIdAddFieldApprovalEndpoint/Execute'
      : '/Turfy/GetByIdUpdateFieldApprovalEndpoint/Execute';

    try {
      const response = await api.get(endpoint, {
        baseURL: FIELD_API_URL, 
        params: { adminTaskId: id } 
      });
      return response.data;
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  submitReview: async (dataObject, isNewRequest = true) => {
    const endpoint = isNewRequest 
      ? '/Turfy/UpdateAddFieldApprovalEndpoint/Execute'
      : '/Turfy/UpdateUpdateFieldApprovalEndpoint/Execute';

    const formData = new FormData();

    // Helper to add 'requestData.' prefix
    const append = (key, value) => {
        if (value !== null && value !== undefined) {
            formData.append(`requestData.${key}`, value);
        }
    };

    // 1. Append Simple Fields
    append('AdminTaskId', dataObject.AdminTaskId);
    append('RequestStatus', dataObject.RequestStatus);
    append('RequestType', dataObject.RequestType);
    append('Name', dataObject.Name);
    append('Description', dataObject.Description);
    append('DefaultPrice', dataObject.DefaultPrice);
    append('FieldSize', dataObject.FieldSize);
    append('SportType', dataObject.SportType);
    append('FieldStatus', dataObject.FieldStatus);
    append('SurfaceType', dataObject.SurfaceType);
    append('OpeningFrom', dataObject.OpeningFrom);
    append('OpeningUntil', dataObject.OpeningUntil);
    append('BookingPolicyType', dataObject.BookingPolicyType);
    append('CancellationPolicy', dataObject.CancellationPolicy);
    append('FieldFormat', dataObject.FieldFormat);
    append('Facilities', dataObject.Facilities);
    // append('Address', dataObject.Address);
    // append('Latitude', dataObject.Latitude);
    // append('Longitude', dataObject.Longitude);

    // 2. Append Lists (ImagesUrls)
    if (dataObject.ImagesUrls && Array.isArray(dataObject.ImagesUrls)) {
        if (dataObject.ImagesUrls.length === 0) {
             // OPTIONAL: Send empty string if backend strictly requires the key
             // formData.append('requestData.ImagesUrls', ''); 
        } else {
            dataObject.ImagesUrls.forEach((url, index) => {
                formData.append(`requestData.ImagesUrls[${index}]`, url);
            });
        }
    }

    // 3. Append Files (NewImages)
    if (dataObject.NewImages && Array.isArray(dataObject.NewImages)) {
        dataObject.NewImages.forEach((file) => {
            formData.append('requestData.NewImages', file);
        });
    }

    try {
      const response = await api.put(endpoint, formData, {
        baseURL: FIELD_API_URL,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Submit Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  }
};

export default fieldService;