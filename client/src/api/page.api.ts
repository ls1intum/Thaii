import { PageBody } from "../types/page/page.types";
import api from "./interceptor.api";

// Fetches all pages from the API
// @returns The response from the API containing the list of all pages
export const fetchPages = async () => {
  try {
    const response = await api.get(`/api/v1/pages/`);
    return response; 
  } catch (error) {
    throw error;
  }
};

// Fetches insight-related pages from the API
// @returns The response from the API containing the list of pages with insights
export const fetchInsightPages = async () => {
  try {
    const response = await api.get(`/api/v1/pages/insights/`);
    return response; 
  } catch (error) {
    throw error;
  }
};

// Fetches a specific page by its ID from the API
// @param pageId - The unique identifier of the page to be fetched
// @returns The response from the API containing the details of the requested page
export const fetchPageById = async (pageId: number) => {
    try {
      const response = await api.get(`/api/v1/pages/${pageId}/`);
      return response; 
    } catch (error) {
      throw error;
    }
  };

// Creates a new page by sending a POST request with the page data
// @param page - An object of type PageBody containing page details
// @returns The response from the API if the page is created successfully
export const createPage = async (page: PageBody) => {
  try {
    const response = await api.post("/api/v1/pages/", page);
    return response; 
  } catch (error) {
    throw error;
  }
};

// Updates an existing page by sending a PUT request with the updated page data
// @param id - The unique identifier of the page to be updated
// @param page - An object of type PageBody containing updated page details
// @returns The response from the API if the page is updated successfully
export const changePage = async (id: number, page: PageBody) => {
  try {
    const response = await api.put(`/api/v1/pages/${id}/`, page);
    return response; 
  } catch (error) {
    throw error;
  }
};

// Deletes a specific page by its ID from the API
// @param id - The unique identifier of the page to be deleted
// @returns The response from the API if the page is deleted successfully
export const deletePage = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/pages/${id}/`);
    return response; 
  } catch (error) {
    throw error;
  }
};
