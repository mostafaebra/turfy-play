import  API  from './API'; // Use custom instance

const LOGIN_URL = "http://turfy.runasp.net/Turfy/LoginUserEndpoint/Handle"; 

export const authApi = {
  login: async (emailOrPhone, password) => {
    try {
      const payload = {
        "emailOrPhone": emailOrPhone,
        "password": password,
        "discriminator": 3 // player
      };

      console.log("Sending Login Request:", JSON.stringify(payload, null, 2));

      // Use API.post. The interceptor will skip adding a token for login
      // because you don't have one yet, which is correct.
      const response = await API.post(LOGIN_URL, payload);

      return response.data;
    } catch (error) {
      console.error("Login API Error:", error);
      throw error;
    }
  }
};