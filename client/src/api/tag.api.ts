import { TagBody } from "../types/page/page.types";
import api from "./interceptor.api";

// Fetches all tags from the API
// @returns The response from the API containing the list of all tags
export const fetchTags = async () => {
  try {
    const response = await api.get(`/api/v1/tags/`);
    return response; 
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Creates a new tag by sending a POST request with the tag data
// @param tag - An object of type TagBody containing tag details
// @returns The response from the API if the tag is created successfully
export const createTag = async (tag: TagBody) => {
  try {
    const response = await api.post("/api/v1/tags/", tag);
    return response; 
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
};

// Delete existing tag of user
// @id: id of tag to delete
export const deleteTag = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/tags/${id}/`);
    return response;
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw error;
  }
};
