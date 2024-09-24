import axios from "axios";
import { ActivationBody, UserBody } from "../types/register/register.types";

const apiRefresh = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

// Authenticate a registered user into the system
// @user: username: string, password: string
// @response: token and refresh token
export const loginUser = async (user: UserBody) => {
  try {
    const response = await apiRefresh.post("api/v1/token/", user);
    return response;
  } catch (error) {
    throw error;
  }
};

// Refresh expired token with the provided refresh token
// @refresh: JWT to refresh token
// @response: JWT to authenticate user
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

// Register a new user with a username and a password. The username (email) must be whitelisted before registering
// @user: username: string, password: string
// @response: status 201 if created and an email is sent to the email
export const registerUser = async (user: UserBody) => {
  try {
    const response = await apiRefresh.post("api/v1/user/register/", user);
    return response;
  } catch (error) {
    throw error;
  }
};

// Activate account by by clicking on a link
// @activation: uique query parameters to activate account of users 
export const activateUser = async (activation: ActivationBody) => {
  try {
    const response = await apiRefresh.post("api/v1/user/activate/", activation);
    return response;
  } catch (error) {
    throw error;
  }
};
