import axios from "axios";
import { ActivationBody, UserBody } from "../types/register/register.types";

const apiRefresh = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

export const loginUser = async (user: UserBody) => {
  try {
    const response = await apiRefresh.post("api/v1/token/", user);
    return response;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (refresh: string) => {
  try {
    const response = await apiRefresh.post("api/v1/token/refresh/", {
      refresh: refresh,
    });
    return response.data.access;
  } catch (error: any) {
    throw error;
  }
};

export const registerUser = async (user: UserBody) => {
  try {
    const response = await apiRefresh.post("api/v1/user/register/", user);
    return response;
  } catch (error) {
    throw error;
  }
};

export const activateUser = async (activation: ActivationBody) => {
  try {
    const response = await apiRefresh.post("api/v1/user/activate/", activation);
    return response;
  } catch (error) {
    throw error;
  }
};
