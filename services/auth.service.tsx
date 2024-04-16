// auth.service.tsx

import axios from 'axios';

const BASE_URL = 'https://demo-pasient.kamy.no/wp-json/iteket-b-auth-api/v1';

// Now you can use BASE_URL to make requests to your custom authentication endpoints.


interface LoginResponse {
  token: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    display_name: string;
    token: string;
    user_email: string;
    user_id: number;
    user_login: string;
    user_role: string;
  };
}

export const AuthService = {
  
  login: async (user: User): Promise<LoginResponse> => {
    try {
      console.log('----------');
      const response = await axios.post(`${BASE_URL}/login`, user);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  signup: async (user: User): Promise<void> => {
    try {
      await axios.post(`${BASE_URL}/signup`, user);
    } catch (error) {
      throw error.response.data;
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    try {
      await axios.post(`${BASE_URL}/forgot-password`, { email });
    } catch (error) {
      throw error.response.data;
    }
  },

  resetPassword: async (email: string, newPassword: string, token: string): Promise<void> => {
    try {
      await axios.post(`${BASE_URL}/reset-password`, { email, newPassword, token });
    } catch (error) {
      throw error.response.data;
    }
  }
};
