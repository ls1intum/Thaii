import { LabelBody } from "../types/chatbot/chatbot.types";
import api from "./interceptor.api";

// Fetches all labels from the API
// @returns The response from the API containing the list of labels
export const fetchLabels = async () => {
  try {
    const response = await api.get(`/api/v1/labels/`);
    return response; 
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Creates a new label by sending a POST request with the label data
// @param label - An object of type LabelBody containing label details
// @returns The response from the API if the label is created successfully
export const createLabel = async (label: LabelBody) => {
  try {
    const response = await api.post("/api/v1/labels/", label);
    return response; 
  } catch (error) {
    console.error("Error creating label:", error);
    throw error;
  }
};

// Delete existing label of user
// @id: id of label to delete
export const deleteLabel = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/labels/${id}/`);
    return response;
  } catch (error) {
    console.error("Error deleting label:", error);
    throw error;
  }
};

