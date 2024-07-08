import { LabelBody } from "../types/chatbot/chatbot.types";
import api from "./interceptor.api";

export const fetchLabels = async () => {
  try {
    const response = await api.get(`/api/v1/labels/`);
    return response; 
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createLabel = async (label: LabelBody) => {
  try {
    const response = await api.post("/api/v1/labels/", label);
    return response; 
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
