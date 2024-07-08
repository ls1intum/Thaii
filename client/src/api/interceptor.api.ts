import axios from "axios";
import { ACCESS_TOKEN } from "../helpers/auth.helpers";
import { isTokenExpired } from "../helpers/token.helpers";
import { refreshToken } from "./auth.api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      if (isTokenExpired(token)) {
        const newToken = await refreshToken(token);
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
