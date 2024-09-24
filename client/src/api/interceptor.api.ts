import axios from "axios";
import { ACCESS_TOKEN } from "../helpers/auth.helpers";
import { isTokenExpired } from "../helpers/token.helpers";
import { refreshToken } from "./auth.api";

// Creates an axios instance with the base URL set to the environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

// Interceptor for handling requests, particularly for token management
api.interceptors.request.use(
  async (config) => {
    // Retrieve the access token from local storage
    const token = localStorage.getItem(ACCESS_TOKEN);
    // If a token exists, attach it to the request's Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Check if the token is expired
      if (isTokenExpired(token)) {
        const newToken = await refreshToken(token);
        // Save the new token to local storage and update the Authorization header
        if (newToken) {
          localStorage.setItem(ACCESS_TOKEN, String(newToken));
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      }
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default api;
