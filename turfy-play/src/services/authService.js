import api from './api';

const authService = {
  /**
   * Logs in the user
   * @param {string} emailOrPhone - The user's input
   * @param {string} password - The password
   * @param {number} discriminator - 0: Admin, 1: Owner, 2: Player
   */
  login: async (emailOrPhone, password, discriminator = 0) => {
    try {
      // OPTIMIZATION: Use relative path (api.js handles the domain)
      const response = await api.post('http://turfyplaydev.runasp.net/Turfy/loginuserendpoint/handle', {
        emailOrPhone: emailOrPhone, 
        password: password,
        discriminator: discriminator 
      });
      
      console.log("Login Response:", response.data);
      return response.data; 
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
};

export default authService;