import axios from 'axios';

const LOGIN_URL = "http://turfytesting.runasp.net/Turfy/LoginUserEndpoint/Handle"; 

export const authApi = {
  login: async (emailOrPhone, password) => {
    try {
      const payload = {
        "emailOrPhone": emailOrPhone,
        "password": password,
        "discriminator": 3 // player
      };

      console.log("Sending Login Request:", JSON.stringify(payload, null, 2));

      const response = await axios.post(LOGIN_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error("Login API Error:", error);
      throw error;
    }
  }
};