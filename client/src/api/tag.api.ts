import { TagBody } from "../components/pages/types/pages.types";
import api from "./interceptor.api";

export const fetchTags = async () => {
  try {
    const response = await api.get(`/api/v1/tags/`);
    return response; 
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createTag = async (tag: TagBody) => {
  try {
    const response = await api.post("/api/v1/tags/", tag);
    return response; 
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
