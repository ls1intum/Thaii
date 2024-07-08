import { activateUser, loginUser, registerUser } from "../api/auth.api";
import { ActivationBody, UserBody } from "../types/register/register.types";

export const login = async (user: UserBody) => {
  try {
    const response = await loginUser(user);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const register = async (user: UserBody) => {
  try {
    const response = await registerUser(user);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const activate = async (activation: ActivationBody) => {
  try {
    const response = await activateUser(activation);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
